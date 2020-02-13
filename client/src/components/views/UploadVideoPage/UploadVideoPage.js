import React, {useState} from 'react';
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import {useSelector } from 'react-redux'

 


const { Title } = Typography;
const { TextArea } = Input;

const Private = [
    { value: 0, label: 'Private' },
    { value: 1, label: 'Public' },
]

const Category = [
    { value: 0, label: "Film & Animation" },
    { value: 0, label: "Autos & Vehicles" },
    { value: 0, label: "Music" },
    { value: 0, label: "Pets & Animals" },
    { value: 0, label: "Sports" },
]

    

function UploadVideoPage (props) {
    
    const user = useSelector(state => state.user);

    const [title, setTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [privacy, setPrivacy] = useState(0);
    const [Categories, setCategories] = useState("Film & Animation");
    const [FilePath,setFilePath] = useState('');
    const [Duration,setDuration] = useState('');
    const [Thumbnail,setThumbnail] = useState('')

    const handleChangeTitle = (feres) => {
        setTitle(feres.currentTarget.value)
    }

    const handleChangeDescription = (feres) => {
        setDescription(feres.currentTarget.value)
        console.log(Description)
    }

    const handleChangePrivacy = (feres) => {
        setPrivacy(feres.currentTarget.value)
    }

    const handleChangeCategories = (feres) => {
        setCategories(feres.currentTarget.value)
    }
    const onSubmit = (event) => {
        event.preventDefault();
          // ken Auth false lezmou ya3mel login 9bal   
        if (user.userData && !user.userData.isAuth) {
            return alert('Please Log in First')
        }
        //lezemhom yet3amrou lkoll
        if (title === "" || Description === "" ||
            Categories === "" || FilePath === "" ||
            Duration === "" || Thumbnail === "") {
            return alert('Please first fill all the fields')
        }

        const variables = {
            writer: user.userData._id,
            title: title,
            description: Description,
            privacy: privacy,
            filePath: FilePath,
            category: Categories,
            duration: Duration,
            thumbnail: Thumbnail
        }
        axios.post('/api/video/uploadVideo', variables)
        .then(response => {
            if (response.data.success) {
                alert('video Uploaded Successfully')
                props.history.push('/')
            } else {
                alert('Failed to upload video')
            }
        })

        
       
    }
    const onDrop = (files) => {
        let formData = new FormData();
        const config ={
            header: { 'content-type': 'multipart/form-data' }
        }
        console.log('files')
        formData.append('file',files[0])
        axios.post('/api/video/uploadfiles', formData,config)
        .then(response =>{
            if(response.data.success){
                let variables={
                    filePath:response.data.filePath,
                    fileName:response.data.fileName
                }
                setFilePath(response.data.filePath) 
                axios.post('/api/video/thumbnail' ,variables).then(response=>{
                    if(response.data.success){
                        setDuration(response.data.fileDuration)
                        setThumbnail(response.data.thumbFilePath)

                    }else{
                        alert('failed to make the thumbnails');
                    }
                })       
            }else{
                alert('cannot save the video in the server')
            }
        })
    } 

    return(
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Title level={2} > Upload Video</Title>
        </div>
        <Form onSubmit={onSubmit} >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Dropzone
                        onDrop={onDrop} 
                        multiple={false}
                        maxSize={800000000}>
                        {({ getRootProps, getInputProps }) => (
                            <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <Icon type="plus" style={{ fontSize: '3rem' }} />

                            </div>
                        )}
            </Dropzone>
            {Thumbnail !== "" &&
                        <div>
                            <img src={`http://localhost:5000/${Thumbnail}`} alt="haha" />
                        </div>
                    }
                </div>
        
        <br /><br />

                <label>Title</label>
                <Input
                    onChange={handleChangeTitle}
                    value={title}
                />
        <br /><br />

                <label>Description</label>
                <TextArea
                    onChange={handleChangeDescription}
                    value={Description}
                />
        <br /><br />

                <select onChange={handleChangePrivacy}>
                    {Private.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>

        <br /><br />

                <select onChange={handleChangeCategories}>
                    {Category.map((item, index) => (
                        <option key={index} value={item.label}>{item.label}</option>
                    ))}
                </select>

        <br /><br />
                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
            </Button>
            </Form>

        </div>  
          
    )
 
}

export default UploadVideoPage;

