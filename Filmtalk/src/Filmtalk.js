import React, { useState } from "react";
import './index.css';
import { ChakraProvider, IconButton, Input, Select, Button, Alert,AlertIcon, AlertTitle, Box, useDisclosure, Spinner, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useToast } from '@chakra-ui/react';
import { CheckIcon} from '@chakra-ui/icons'
import { getUser } from './AuthServices';

function Filmtalk() {
    const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
    const { isOpen: isEnlargedOpen, onOpen: onEnlargedOpen, onClose: onEnlargedClose } = useDisclosure();
    const [selectedCard, setSelectedCard] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [movieCards, setMovieCards] = useState([]);
    const [displayedCards, setDisplayedCards] = useState([]);
    const [movieDetails, setMovieDetails] = useState({
        name: '',
        year: '',
        genre1: '',
        genre2: '',
        img: '',
        about: ''
    });
    const [comments, setComments] = useState([]);
    const [commentDetails, setCommentDetails] = useState({
        user: '',
        time: '',
        comment: ''
        
    });
    const [error, setError] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('None');
    const [searchQuery, setSearchQuery] = useState('');
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();//this will prevent the page from reloading (the default behaviour when a form is submitted)
        const { name, year, genre1, genre2, img, about } = movieDetails;
    //what we'll do is first send the new card to the backend then getAll the cards and display them so we have everything in the cardbox
        // Validate Name
        if (!name.trim()) {
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
        const usery = sessionStorage.getItem('user')
        // Create new card and send to backend
        const movieDetails_tobeSent = {
            movie_name: name,
            genre1: genre1,
            genre2: genre2,
            year: year,
            img_src: img,
            about: about,
            username: usery // assuming currentUser is available in the session storage
        };
        try{
        const response = await fetch(process.env.REACT_APP_ADDNEWCARD_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.REACT_APP_API_TOKEN, },
            body: JSON.stringify(movieDetails)
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

        } else {
            console.error('Error adding movie card:', data.message);
            setError('Error adding this title');
        }} catch (error) {
            console.log('An error occurred. Please try again.');
          }

          //call get all cards here before settingMovieCard
        try{
            const responsetwo = await fetch(process.env.REACT_APP_GETALLCARDS_URL, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.REACT_APP_API_TOKEN },
                body: ''
            });

            const datatwo = await responsetwo.json();
        
            if (responsetwo.ok) {
                console.log('Movie cards retrieved');
                // Update the state with the retrieved movie cards
                setMovieCards(datatwo);
                setDisplayedCards(datatwo); 
    
            } else{
                console.error('Error retrieving movie card');
                setError('Error retrieving movie cards :-(');
            }
        
        } catch (error) {
                console.log('An error occurred. Please try again.');
              }
        
        //setMovieCards([...movieCards, newCard]);
        //setDisplayedCards([...movieCards, newCard]);

        // Reset movie details
        setMovieDetails({
            name: '',
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
                card.name.toLowerCase().includes(query)
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
        if (filter !== 'None') {
            if (filter.startsWith('Sort:')) {
                if (filter === 'Sort: A-Z') {
                    filteredCards.sort((a, b) => a.name.localeCompare(b.name));
                } else if (filter === 'Sort: Z-A') {
                    filteredCards.sort((a, b) => b.name.localeCompare(a.name));
                } else if (filter === 'Year Released:E-L') {
                    filteredCards.sort((a, b) => a.year - b.year);
                } else if (filter === 'Year Released:L-E') {
                    filteredCards.sort((a, b) => b.year - a.year);
                }
            } else {
                filteredCards = movieCards.filter(card => card.genre1 === filter || card.genre2 === filter);
            }
        }
        // Apply the search query filter
        if (searchQuery !== '') {
            filteredCards = filteredCards.filter(card =>
                card.name.toLowerCase().includes(searchQuery)
            );
        }
        setDisplayedCards(filteredCards);
    };

    const enlargeCard = (card) => {
        setSelectedCard(card);
        onEnlargedOpen();

    };
    

    return (
        <ChakraProvider>
            <section className='fullbody'>
                <nav className='navig'>
                    FilmTalk
                    <p className='tag'>by Emiko</p>
                </nav>
                <div className='intro'>
                    <p id='p1'>Hi All!</p>
                    <p id='p2'>Welcome to FilmTalk, a film blog site I've built from scratch with React, Javascript, Terraform and AWS Services. I am a film enthusiast and I mostly enjoy dialogue driven dramas that really focus on exploring the human condition. I decided to make this site so I can share my thoughts and opinions with everyone, and let people share their thoughts on these films as well. I hope this site finds individuals who are as interested in film as I am.</p>
                    <p id='p3'>Enjoy!</p>
                </div>

                <div className='moviebox'>
                    <div className='topbar'>
                        <div id='search'>
                            <Input
                                id='searchbar'
                                focusBorderColor='rgb(62, 176, 246)'
                                placeholder='Search Movies...'
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </div>
                        <div className="rightside">
                            <p>Filter:</p>
                            &nbsp;
                            <Select iconSize='14px' id='filter' placeholder='None' onChange={handleFilterChange}>
                                <option value='Sort: A-Z'>Sort: A-Z</option>
                                <option value='Sort: Z-A'>Sort: Z-A</option>
                                <option value='Year Released:E-L'>Year Released (Earliest to Latest)</option>
                                <option value='Year Released:L-E'>Year Released (Latest to Earliest)</option>
                                <option value='Romance'>Romance</option>
                                <option value='Thriller'>Thriller</option>
                                <option value='Action'>Action</option>
                                <option value='Comedy'>Comedy</option>
                                <option value='Horror'>Horror</option>
                                <option value='Black Voices'>Black Voices</option>
                                <option value='Anime'>Anime</option>
                                <option value='Fantasy'>Fantasy</option>
                                <option value='Documentary/Docuseries'>Documentary/Docuseries</option>
                                <option value='None'>None</option>
                            </Select>
                            <Button id='addrec' colorScheme='rgb(62, 176, 246);' onClick={onAddOpen}>+ Add</Button>
                        </div>
                    </div>
                    <div className='cardbox'>
                        {displayedCards.map(card => (
                            <div className='movie_card' onClick={() => enlargeCard(card)}key={`movie_card_${card.name}`}>
                                <div className='card_img'>
                                    {card.img && <img className='new_img' src={card.img} alt={card.name} />}
                                </div>
                                <div className='card_rightside'>
                                    <p className='card_title'>{card.name}</p>
                                    <p className='card_yearandgenre'>{card.year}&nbsp;|&nbsp;{[card.genre1, card.genre2].filter(Boolean).join(', ')}</p>
                                    <div className='deets'>{card.about}</div>
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
                                    Name:<Input id='name' focusBorderColor='rgb(62, 176, 246)' placeholder='e.g. Transformers' value={movieDetails.name} onChange={handleChange} />
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
                                    Image link (Optional):<Input id='img' focusBorderColor='rgb(62, 176, 246)' placeholder='' value={movieDetails.img} onChange={handleChange} />
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
                    <ModalContent bg="rgb(46, 44, 44)" color="white">
                        <ModalHeader textAlign="center">{selectedCard?.name}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody display="flex" flexDirection="column" alignItems="center" marginLeft="5%" marginRight="5%" height="fit-content" overflow-y="scroll">
                            <div className="en-content"></div>
                            <div className='card_img'>
                                {selectedCard?.img && <img className='new_img' src={selectedCard.img} alt={selectedCard.name} />}
                            </div>
                            <Button id='addwatchlist' colorScheme='rgb(62, 176, 246);'>+</Button>
                            <Button id='remwatchlist' colorScheme='rgb(62, 176, 246);'>-</Button>
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
                                
                                </div>
                                <div className="add-comm">
                                <Input id='comm' focusBorderColor='rgb(62, 176, 246)' placeholder='Add a comment...' width="90%"/>
                                <IconButton
                                colorScheme='blue'
                                aria-label='comment-submit'
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
