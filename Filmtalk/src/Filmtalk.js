import React, { useState, useEffect } from "react";
import './index.css';
import { ChakraProvider, IconButton, Input, Select, Button, Alert,AlertIcon, AlertTitle, Box, useDisclosure, Spinner, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useToast } from '@chakra-ui/react';
import { CheckIcon} from '@chakra-ui/icons'
import { getUser } from './AuthServices';
import ic1 from './movie-with-students-audience-svgrepo-com.svg'
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

function Filmtalk() {
    const usery = getUser().username//sessionStorage.getItem('user')
    console.log(usery)
    const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
    const { isOpen: isEnlargedOpen, onOpen: onEnlargedOpen, onClose: onEnlargedClose } = useDisclosure();
    const [selectedCard, setSelectedCard] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [movieCards, setMovieCards] = useState([]);
    const [displayedCards, setDisplayedCards] = useState([]);
    const [movieDetails, setMovieDetails] = useState({
        movie_name: '',
        year: '',
        genre1: '',
        genre2: '',
        img_src: '',
        about: ''
    });
    const [comments, setComments] = useState([]);
    const [currentComment, setCurrentComment] = useState("")
    const [error, setError] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('None');
    const [searchQuery, setSearchQuery] = useState('');
    const toast = useToast();

    useEffect(() => {
        getAllTheCards(); // Fetch movie cards on mount
    }, []);
   

    async function retrieveAllTheComments(card_id) {
        console.log('The card id is:', card_id)
        const pack = {card_id: card_id};

        try {
            const response = await fetch(`${process.env.REACT_APP_RETRIEVECOMMENTS_URL}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.REACT_APP_API_TOKEN },
                body: JSON.stringify(pack)
            });
            
    
            const data = await response.json();
    
            if (response.ok) {
                console.log('Comments retrieved for this card:', data);
    
                // Parse the response to extract comment details
                const parsedComments = data.L.map(item => ({
                    comment: item.M.comment.S,
                    username: item.M.username.S,
                    time: item.M.time.S
                }));
    
                // Store the parsed comments in the state
                setComments(parsedComments);
            } else if (response.status === 500) {
                console.warn('Failed to retrieve comments:', data.message);
                toast({
                    title: 'Warning',
                    description: 'Failed to retrieve comments :-(',
                    status: 'warning',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.log('An error retrieving the comments occurred. Please try again.');
        }
    }
    


    const handleCommentChange = (e) =>{
        setCurrentComment(e.target.value);
        console.log(currentComment);
    }

    async function handleSubmitComment (currentUser, card_id) {
        if (typeof currentComment === 'string' && !currentComment.trim()){
            toast({
                title: 'Empty Comment',
                description: 'Please enter a comment',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } else{
            
            const pack = {
                username: currentUser,
                card_id: card_id,
                comment: currentComment
            }
            try{
                
                const response = await fetch(process.env.REACT_APP_SAVECOMMENT_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.REACT_APP_API_TOKEN },
                    body: JSON.stringify(pack)
                });
    
                const data = await response.json();
        
                if (response.ok) {
                    retrieveAllTheComments(card_id)
                    setCurrentComment('');
                    console.log('Added Comment:', data);
                    
                    toast({
                        title: 'Added',
                        description: 'Your thoughts have been added!',
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    });
                }
                else if (response.status === 500) {
                    console.warn('Failed to add comment:', data.message);
                    toast({
                        title: 'Warning',
                        description: 'Failed to add comment',
                        status: 'warning',
                        duration: 3000,
                        isClosable: true,
                    });}
            }
            catch (error){
                console.log('An error getting submitting cards occurred. Please try again.');
            }
        }
    }

    async function getAllTheCards (){
        try{
            const response = await fetch(process.env.REACT_APP_GETALLCARDS_URL, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.REACT_APP_API_TOKEN },
            });

            const data = await response.json();
    
            if (response.ok) {
                console.log('Movie cards retrieved:', data);
                
                // Update the state with the retrieved movie cards
                setMovieCards(data.map(card => ({ ...card, watchlist: card.watchlist || [] })));
                setDisplayedCards(data); 

            } else{
                console.error('Error retrieving movie card:', data.message);
                setError('Error retrieving movie cards :-(');
            }
        
        } catch (error) {
                console.log('An error getting cards occurred. Please try again.');
            }

    }
        

    const handleSubmit = async (e) => {
        e.preventDefault();//this will prevent the page from reloading (the default behaviour when a form is submitted)
        const { movie_name, year, genre1, genre2, img_src, about } = movieDetails;
    //what we'll do is first send the new card to the backend then getAll the cards and display them so we have everything in the cardbox
        // Validate Name
        if (typeof movie_name === 'string' && !movie_name.trim()) {
            setError('Please enter a name');
            return;
        }

        // Validate Year
        const yearNum = parseInt(year, 10);
        if (isNaN(yearNum) || yearNum < 1800 || yearNum > 2024) {
            setError('Please enter a valid Year');
            return;
        }

        // Clear error
        setError(null);
        
        
        // Create new card and send to backend
        const movieDetails_tobeSent = {
            movie_name: movie_name,
            genre1: genre1,
            genre2: genre2,
            year: year,
            img_src: img_src,
            about: about,
            username: usery // assuming currentUser is available in the session storage
        };
        try{
        const response = await fetch(process.env.REACT_APP_ADDNEWCARD_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.REACT_APP_API_TOKEN, },
            body: JSON.stringify(movieDetails_tobeSent)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Movie card added:', data);
            // Handle success (e.g., update UI)
            onAddClose();//modal is closed here and success toast is displayed
            toast({
                title: 'Success',
                description: 'Your Recommendation has been added',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            getAllTheCards();

        } else {
            console.error('Error adding movie card:', data.message);
            setError('Error adding this title');
        }} catch (error) {
            console.log('An error occurred. Please try again.');
          }
         
         //call get all cards here before settingMovieCard
        
        //setMovieCards([...movieCards, newCard]);
        //setDisplayedCards([...movieCards, newCard]);

        // Reset movie details
        setMovieDetails({
            movie_name: '',
            year: '',
            genre1: '',
            genre2: '',
            img: '',
            about: ''
        });
    };

    // Dynamically checks all the movie cards and filters them based on the search query
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        if (query === '') {
            setDisplayedCards(movieCards);
        } else {
            const filteredCards = movieCards.filter(card =>
                card.movie_name && card.movie_name.toLowerCase().includes(query)
            );
            setDisplayedCards(filteredCards);
        }
    };
    

    // Here we use handleChange to dynamically update each field in the movieDetails useState
    const handleChange = (e) => {
        const { id, value } = e.target;
        setMovieDetails(prevDetails => ({
            ...prevDetails,
            [id]: value
        }));
    };

    const handleFilterChange = (e) => {
        const value = e.target.value;
        setSelectedFilter(value);
        handleFilter(value);
    };

    const handleFilter = (filter) => {
        
        let filteredCards = [...movieCards];
        if (filter === 'Your Watchlist') {
    
            filteredCards = movieCards.filter(movie => movie.watchlisters && movie.watchlisters.includes(getUser().username));
            console.log('watchlist items', filteredCards)
        } else if (filter !== 'None') {
            filteredCards = movieCards.filter(card => card.genre1 === filter || card.genre2 === filter);
        }
        
        if (searchQuery !== '') {
            filteredCards = filteredCards.filter(card =>
                card.movie_name.toLowerCase().includes(searchQuery)
            );
        }
        setDisplayedCards(filteredCards);
    };
    

    const enlargeCard = (card) => {
        setSelectedCard(card);
        onEnlargedOpen();
        retrieveAllTheComments(card.card_id);
    };
    
    async function addCardToWatchlist (currentuser, card_id){
        const pack = {
            username: currentuser,
            card_id: card_id
        }
        setError(null);
        try{
            const response = await fetch(process.env.REACT_APP_ADDTOWATCHLIST_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.REACT_APP_API_TOKEN },
                body: JSON.stringify(pack)
            });

            const data = await response.json();
    
            if (response.ok) {
                getAllTheCards();
                console.log('Title was added to your watchlist:', data);
                toast({
                    title: 'Success',
                    description: 'Title has been added to your watchlist',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });

            }
            else if (response.status === 401) {
                console.warn('This title is already in your watchlist:', data.message);
                toast({
                    title: 'Warning',
                    description: 'This title is already in your watchlist',
                    status: 'warning',
                    duration: 3000,
                    isClosable: true,
                });}

             else{
                console.error('Error adding to watchlist:', data.message);
                setError('Error adding to watchlist :-(');
            }
        
        } catch (error) {
                console.log('An error adding the card occured. Please try again.');
            }
    }

    async function removeCardFromWatchlist(currentuser, card_id) {
        const pack = {
            username: currentuser,
            card_id: card_id
        };
        setError(null);
        try {
            const response = await fetch(process.env.REACT_APP_REMOVEFROMWATCHLIST_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.REACT_APP_API_TOKEN },
                body: JSON.stringify(pack)
            });
    
            const data = await response.json();
    
            if (response.ok) {
                getAllTheCards();
                console.log('Title was removed from your watchlist:', data);
                toast({
                    title: 'Success',
                    description: 'Title has been removed from your watchlist',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else if (response.status === 401) {
                console.warn('This title is not in your watchlist:', data.message);
                toast({
                    title: 'Warning',
                    description: 'This title is not in your watchlist',
                    status: 'warning',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                console.error('Error removing from watchlist:', data.message);
                setError('Error removing from watchlist :-(');
            }
        } catch (error) {
            console.log('An error removing the card occurred. Please try again.');
            setError('An unexpected error occurred :-(');
        }
    }
    
    return (
        <ChakraProvider>
            <section className='fullbody'>
                <nav className='navig'>
                    <img id='ico1'src={ic1}></img>
                    &nbsp;
                    <b>FilmTalk</b>
                    <p className='tag'>by Emiko</p>
                </nav>
                <div className='intro'>
                <Avatar name={usery} src='https://bit.ly/broken-link' />
                </div>

                <div className='moviebox'>
                    <div className='topbar'>
                        <div id='search'>
                            <Input
                                id='searchbar'
                                focusBorderColor='blue'
                                placeholder='Search Titles...'
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </div>
                        <div className="filt_top">
                            <p>Filter:</p>
                            &nbsp;
                            <Select iconSize='14px' id='filter' placeholder='' onChange={handleFilterChange}>
                                <option value='None'>None</option>
                                <option value='Your Watchlist'>Your Watchlist</option>
                                <option value='Romance'>Romance</option>
                                <option value='Thriller'>Thriller</option>
                                <option value='Action'>Action</option>
                                <option value='Comedy'>Comedy</option>
                                <option value='Horror'>Horror</option>
                                <option value='Black Voices'>Black Voices</option>
                                <option value='Anime'>Anime</option>
                                <option value='Fantasy'>Fantasy</option>
                                <option value='Documentary/Docuseries'>Documentary/Docuseries</option>
                                <option value='Psychological Thrillers'>Psychological Thrillers</option>
                               
                            </Select>
                            </div>
                            <div className='addtop'>
                            <Button id='addrec' colorScheme='rgb(8, 114, 181);' onClick={onAddOpen}>+ Add</Button>
                            </div>
                        
                    </div>
                    <div className='cardbox'>
                        {displayedCards.map(card => (
                            <div className='card_cont'>
                                 
                            <div className='movie_card' onClick={() => enlargeCard(card)}key={`movie_card_${card.card_id}`}>
                           
                                <div className='card_img'>
                                    {card.img_src && <img className='new_img' src={card.img_src} alt={card.name} />}
                                </div>
                                <div className='card_rightside'>
                                <p className='card_title'>{card.movie_name}</p>
                                    <p className='card_yearandgenre'>{card.year}&nbsp;|&nbsp;{[card.genre1, card.genre2].filter(Boolean).join(', ')}</p>
                                    <div className='deets'>{card.about}</div>
                                </div>
                            </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modal */}
                <Modal id='movie_entry' isOpen={isAddOpen} onClose={onAddClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Add a Movie Recommendation</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            
                                <Box id='movname'>
                                    Name:<Input id='movie_name' focusBorderColor='rgb(62, 176, 246)' placeholder='e.g. Transformers' value={movieDetails.movie_name} onChange={handleChange} />
                                </Box>
                                <Box id='movyear'>
                                    Release Year:<Input id='year' focusBorderColor='rgb(62, 176, 246)' placeholder='e.g. 1996' value={movieDetails.year} onChange={handleChange} />
                                </Box>
                                <Box id='movgenre1'>
                                    Genre1: 
                                    <Select id='genre1' iconSize='20px' className='genre_filter' placeholder='None' value={movieDetails.genre1} onChange={handleChange}>
                                        <option value='Romance'>Romance</option>
                                        <option value='Thriller'>Thriller</option>
                                        <option value='Action'>Action</option>
                                        <option value='Comedy'>Comedy</option>
                                        <option value='Horror'>Horror</option>
                                        <option value='Black Voices'>Black Voices</option>
                                        <option value='Anime'>Anime</option>
                                        <option value='Fantasy'>Fantasy</option>
                                        <option value='Documentary/Docuseries'>Documentary/Docuseries</option>
                                    </Select>
                                </Box>
                                <Box id='movgenre2'>
                                    Genre2:
                                    <Select id='genre2' iconSize='20px' className='genre_filter' placeholder='None' value={movieDetails.genre2} onChange={handleChange}>
                                        <option value='Romance'>Romance</option>
                                        <option value='Thriller'>Thriller</option>
                                        <option value='Action'>Action</option>
                                        <option value='Comedy'>Comedy</option>
                                        <option value='Horror'>Horror</option>
                                        <option value='Black Voices'>Black Voices</option>
                                        <option value='Anime'>Anime</option>
                                        <option value='Fantasy'>Fantasy</option>
                                        <option value='Documentary/Docuseries'>Documentary/Docuseries</option>
                                    </Select>
                                </Box>
                                <Box id='movimg'>
                                    Image link (Optional):<Input id='img_src' focusBorderColor='rgb(62, 176, 246)' placeholder='' value={movieDetails.img_src} onChange={handleChange} />
                                </Box>
                                <Box id='movabout'>
                                    About:<Input id='about' focusBorderColor='rgb(62, 176, 246)' placeholder='e.g. Tell us about the movie...' value={movieDetails.about} onChange={handleChange} />
                                </Box>
                        
                            {error && (
                                <Alert status='error' mt={4}>
                                    <AlertIcon />
                                    <AlertTitle>{error}</AlertTitle>
                                </Alert>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='rgb(2, 2, 100);' mr={3} onClick={onAddClose}>
                                Close
                            </Button>
                            <Button
                                id='submit_details'
                                variant='ghost'
                                onClick={handleSubmit}
                                isLoading={isLoading}
                                loadingText='Submitting'
                                spinner={<Spinner size="sm" />}
                            >
                                Submit
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
                {/* Enlarged Card Modal */}
                <Modal className='enlargedCard' isOpen={isEnlargedOpen} onClose={onEnlargedClose} size='lg'>
                    <ModalOverlay />
                    <ModalContent bg="rgb(46, 44, 44)" color="white" overflowY='scroll' width='85vw' maxHeight='80vh'>
                        <ModalHeader textAlign="center">{selectedCard?.movie_name}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody display="flex" flexDirection="column" alignItems="center" marginLeft="5%" marginRight="5%" height="fit-content" overflow-y="scroll">
                            <div className="en-content"></div>
                            <p className="uploadedBy" alignItems="end" textAlign='end'>Review by {selectedCard?.username}</p>
                            <div className='card_img'>
                                {selectedCard?.img_src && <img className='new_img' src={selectedCard.img_src} alt={selectedCard.name} />}
                            </div>
                            <div className='watchlist_sec'>
                                <p>Watchlist</p>
                                <div className='watchlist_buttons'>
                                <Button  size='sm' marginRight='2px' onClick={() => addCardToWatchlist(usery,selectedCard?.card_id)} id='addwatchlist' colorScheme='rgb(62, 176, 246);'>+</Button>
                                <Button size='sm' marginLeft='2px'onClick={() => removeCardFromWatchlist(usery,selectedCard?.card_id)} id='remwatchlist' colorScheme='rgb(62, 176, 246);'>-</Button>
                                <FontAwesomeIcon icon="fa-solid fa-thumbs-up" style={{color: "#74C0FC",}} />
                                </div>
                            </div>
                            <div className='en_card_rightside'>
                                
                                <p className='en_card_yearandgenre'><b>
                                    {selectedCard?.year} &nbsp;|&nbsp;
                                    {[selectedCard?.genre1, selectedCard?.genre2].filter(Boolean).join(', ')}
                                    </b></p>
                                <div className='en-deets'>{selectedCard?.about}</div>
                            </div>
                            <div className='comment-section'>
                                <p id="com-title">Comments</p>
                                <div id="en-hr"/>
                                <div className='comment-box'>
                                    {comments.map((comment, index) => (
                                        <div className='whole_comment' key={index}>
                                            <div className='prof_icon'><Avatar size='sm'name={comment.username} src='https://bit.ly/broken-link' /></div>
                                            <div className='comment_rightside'>
                                                <div className='comm_top'>
                                                    <p><b>@{comment.username}</b></p>&nbsp;
                                                    <p>{comment.time}</p>
                                                </div>
                                                <div className='comm_bottom'>{comment.comment}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="add-comm">
                                <Input id='comm' value={currentComment} onChange={handleCommentChange} focusBorderColor='rgb(62, 176, 246)' placeholder='Add a comment...' width="90%"/>
                                <IconButton
                                colorScheme='blue'
                                aria-label='comment-submit'
                                onClick={() => handleSubmitComment(usery, selectedCard?.card_id)}
                                icon={<CheckIcon />}
                                />
                                </div>
                            </div>
                        </ModalBody>
                            
                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={onEnlargedClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </section>
        </ChakraProvider>
    );
}

export default Filmtalk;
