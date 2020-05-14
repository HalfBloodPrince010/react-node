import React from 'react';
import commentBox from 'commentbox.io';
// import './home.css'

class PageWithComments extends React.Component {

    componentDidMount() {

        this.removeCommentBox = commentBox('[PROJECT-ID]');
    }

    componentWillUnmount() {

        this.removeCommentBox();
    }

    render() {

        return (
            <div className="commentbox" id={this.props.id}/>
        );
    }
}

export default PageWithComments