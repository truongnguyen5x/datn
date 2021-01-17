import React, { useRef, useState, useEffect } from 'react'
import { Camera } from 'react-feather'
import "../assets/scss/components/upload.scss"


const Upload = props => {
    const ref = useRef()
    const [image, setImage] = useState('')

    const onChangeImage = e => {
        if (ref.current.files.length) {
            props.onChange(ref.current.files[0])
        }
    }

    useEffect(() => {
        if (props.image) {
            setImage(props.image)
        }
    }, [props.image])

    return <div className="upload-image">
        <div className="image">
            {image
                ? image.name
                    ? <img src={URL.createObjectURL(image)} />
                    : <img src={image} onError={() => setImage(null)} />
                : null}

        </div>
        <div className="camera" onClick={() => ref.current.click()}>
            {image
                ? <Camera className="icon-2" color="white" />
                : <Camera className="icon" />}
        </div>

        <input ref={ref} type="file" accept="image/*" onChange={onChangeImage} />
    </div>
}

export default Upload