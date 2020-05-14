import React from 'react'
import { Modal } from 'react-bootstrap';
import './home.css';
import {FacebookShareButton, TwitterShareButton, EmailShareButton} from 'react-share';
import {EmailIcon,FacebookIcon,TwitterIcon} from 'react-share';

const Sharemodal = props =>{
    return(
                <Modal show={props.isopenModal} onHide={()=>props.handleClose()}>
                        <Modal.Header closeButton>
                            <Modal.Title>{props.activeItem.title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{marginTop:'1px',marginBottom:'1px', paddingBottom:'0px', fontSize:'20px'}} className="d-flex justify-content-center"><b>Share via</b></Modal.Body>
                        <Modal.Body className="d-flex justify-content-between">
                            <FacebookShareButton url={props.activeItem.webUrl} hashtag='CSCI_571_NewsApp' className="share">
                                <FacebookIcon size={70} className='float-left' round={true}/>
                            </FacebookShareButton>
                            <TwitterShareButton url={props.activeItem.webUrl} hashtags={['CSCI_571_NewsApp']}>
                                <TwitterIcon size={70} round={true}/>
                            </TwitterShareButton>
                            <EmailShareButton url={props.activeItem.webUrl} subject='#CSCI_571_NewsApp'>
                                <EmailIcon size={70} className='float-right' round={true}/>
                            </EmailShareButton>
                        </Modal.Body>
                </Modal>
    )
}
export default Sharemodal;