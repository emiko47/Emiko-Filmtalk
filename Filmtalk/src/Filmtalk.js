import React, { useState } from "react";
import './index.css';
import { ChakraProvider, Input, Select, Button, Alert, AlertIcon, AlertTitle, AlertDescription, useDisclosure, Spinner, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, VStack, Box, useToast } from '@chakra-ui/react';

function Filmtalk() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);
    const [movieCards, setMovieCards] = useState([]);
    const [movieDetails, setMovieDetails] = useState({
        name: '',
        year: '',
        genre1: '',
        genre2: '',
        img: '',
        about: ''
    });
    const [error, setError] = useState(null);
    const toast = useToast();

    const handleSubmit = () => {
        const { name, year, genre1, genre2, img, about } = movieDetails;//Remember this line here is almost like assigning variables in a reverse manner. All the fields defined in the movieDetails useState make up the "updated" movieDetails. Remember this is also known as destructuring. We're getting only the fields we need from movieDetails.

        // Validate Name
        if (!name.trim()) {
            setError('Please enter a name');
            return;
        }

        // Validate Year
        const yearNum = parseInt(year, 10);//parses the year string as an integer and makes sure it is in decimal format
        if (isNaN(yearNum) || yearNum < 1800 || yearNum > 2024) {
            setError('Please enter a valid Year');
            return;
        }

        // Clear error
        setError(null);

        // Create new card //img src is only assigned if the 'img' from props exists
        const newCard = (
            <div className='movie_card' key={`movie_card_${name}`}>
                <div className='card_img'>
                    {img && <img className='new_img' src={img} alt={name} />}
                </div>
                <div className='card_rightside'>
                    <p className='card_title'>{name}</p>
                    <p className='card_yearandgenre'>{year}&nbsp;|&nbsp;{[genre1, genre2].filter(Boolean).join(', ')}</p>
                    <div className='deets'>{about}</div>
                </div>
            </div>
        );
            //on line 49 array is created with the genres, then 'filter(Boolean) is called on the array to filter out any false or null values'
        setMovieCards([...movieCards, newCard]);
        onClose();
        toast({
            title: 'Success',
            description: 'Your Recommendation has been added',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });

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

    const handleChange = (e) => {//We use this handler to dynamically update the value of the movieDetails
        const { id, value } = e.target;
        setMovieDetails(prevDetails => ({
            ...prevDetails,
            [id]: value
        }));
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
                            <Input id='searchbar' focusBorderColor='rgb(62, 176, 246)' placeholder='Search Movies...' />
                        </div>
                        <div className="rightside">
                            <Select iconSize='0px' id='filter' placeholder='Filter'>
                                <option value='option1'>Sort: A-Z</option>
                                <option value='option2'>Sort: Z-A</option>
                                <option value='option3'>Year Released (Earliest to Latest)</option>
                                <option value='option4'>Year Released (Latest to Earliest)</option>
                                <option value='option5'>Romance</option>
                                <option value='option6'>Thriller</option>
                                <option value='option7'>Action</option>
                                <option value='option8'>Comedy</option>
                                <option value='option9'>Horror</option>
                                <option value='option10'>Black Voices</option>
                                <option value='option11'>None</option>
                            </Select>
                            <Button id='addrec' colorScheme='rgb(62, 176, 246);' onClick={onOpen}>+ Add</Button>
                        </div>
                    </div>
                    <div className='cardbox'>
                        {movieCards}
                    </div>
                </div>

                {/* Modal */}
                <Modal id='movie_entry' isOpen={isOpen} onClose={onClose}>
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
                            <Button colorScheme='rgb(2, 2, 100);' mr={3} onClick={onClose}>
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
            </section>
        </ChakraProvider>
    );
}

export default Filmtalk;
