import React, { useEffect, useState, useRef } from "react";
import './index.css';
import { ChakraProvider } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
} from '@chakra-ui/react';
import { ChevronDownIcon} from '@chakra-ui/icons'
import { Button, ButtonGroup } from '@chakra-ui/react'
import { Select } from '@chakra-ui/react'
import {
    useDisclosure,
    Spinner,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'





function Filmtalk() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = () => {
        setIsLoading(true);
        // Simulate a network request or some processing delay
        setTimeout(() => {
            setIsLoading(false);
            onClose();
        }, 1000); // 1 second delay
    };



    function addCard(name, year, genre, img, about) {
        return(
            <div className='movie_card'>
                <div classname='card_img'>

                </div>
                <div className='card_rightside'>
                    <p classname='card_title'></p>
                    <div className='deets'></div>
                </div>
            </div>
        );
    }



    return (
        <ChakraProvider>
            <section className='fullbody'>
                <nav className='navig'>
                    <img src="data:image/png;base64,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" />
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
                        {/* Add your movie cards here */}
                    </div>
                </div>

                {/* Modal */}
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Add a Movie Recommendation</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {/* Add your form inputs here */}
                            <div id='movname'>Name:<Input id='mov_namebar' focusBorderColor='rgb(62, 176, 246)' placeholder='e.g. Transformers' /></div>
                            <div id='movyear'>Release Year:<Input id='mov_yearbar' focusBorderColor='rgb(62, 176, 246)' placeholder='e.g. 1996' /></div>
                            <div id='movgenre'>Genre:<Input id='mov_genrebar' focusBorderColor='rgb(62, 176, 246)' placeholder='e.g. Romance' /></div>
                            <div id='movimg'>Image link (Optional):<Input id='mov_imgbar' focusBorderColor='rgb(62, 176, 246)' placeholder='' /></div>
                            <div id='movabout'>About:<Input id='mov_aboutbar' focusBorderColor='rgb(62, 176, 246)' placeholder='e.g. Tell us about the movie...' /></div>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='rgb(2, 2, 100);' mr={3} onClick={onClose}>
                                Close
                            </Button>
                            <Button
                                
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