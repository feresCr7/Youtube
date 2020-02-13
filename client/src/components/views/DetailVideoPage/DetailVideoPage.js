import React,{useEffect, useState , Row,Col} from 'react';
import { List , Typography,Avatar} from 'antd';
import axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscriber from './Sections/Subscriber';



function DetailVideoPage(props)  {
    const videoId=props.match.params.videoId
    const [Video,setVideo] = useState([]);

    const videovariable={
        videoId:videoId
    }
    useEffect(() => {
    axios.post('/api/video/getVideo', videovariable)
   .then(response=>{
        if(response.data.success){
            console.log(response.data.video)
       setVideo(response.data.video)
        }else{
            alert('failed to get video infos')
        
        }
    })
},[])


    
    return(
        <Row>
            
            <Col lg={18} xs={24}>
            
       
         <div className="postPage" style={{ width: '100%', padding: '3rem 4em' }}>
             
                       <video style={{ width: '100%' }} src={`http://localhost:5000/${Video.filepath}`}controls></video>

                        <List.Item
                            actions={[Subscriber]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={Video.writer&&Video.writer.image} />}
                                title={<a href="https://ant.design">Video.title</a>}
                                description={Video.description}
                            />
                            <div></div>
                        </List.Item>
                        </div>
                    </Col>
                        <col lg={6} xs={24}>>
                        <SideVideo />
                        </col>
                        </Row>

                       

      
    )
    
}
export default DetailVideoPage ;
