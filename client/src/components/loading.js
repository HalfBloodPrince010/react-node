import React from 'react'
import './home.css';
import BounceLoader from "react-spinners/BounceLoader";
import { useMediaQuery } from 'react-responsive'

const Loader = props =>{
    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-width: 800px)'
      })
      console.log("Media query", isDesktopOrLaptop)
      let loaderContent = ""
      if(isDesktopOrLaptop){
        loaderContent = (
                            <div className="sweet-loading" style = {{position:'fixed', top:'50%', left:'47%'}}>
                            <BounceLoader
                                style = {{display:'block', background:'#2b4fc4'}}
                                size={35}
                                color={"#2b4fc4"}
                            />
                            <span style={{position:'fixed',left:'46.5%', fontSize:'14px'}}>Loading</span>
                        </div>
                        )
      }
      else{
          loaderContent = (<span></span>)
      }
    return(
        loaderContent
    )
    }

export default Loader;