import React, { useRef } from 'react'
import { Camera } from 'react-feather'
import "../assets/scss/components/upload.scss"


const Upload = props => {
    const ref = useRef()

    const onChangeImage = e => {
        if (ref.current.files.length) {
            props.onChange(ref.current.files[0])
        }
    }

    return <div className="upload-image">
        <div className="image">
            {props.image
                ? props.image.name
                    ? <img src={URL.createObjectURL(props.image)} />
                    : <img src={props.image} />
                : null}

        </div>
        <div className="camera" >
            {props.image
                ? <Camera className="icon-2" color="white" onClick={() => ref.current.click()} />
                : <Camera className="icon" onClick={() => ref.current.click()} />}
        </div>

        <input ref={ref} type="file" accept="image/*" onChange={onChangeImage} />
    </div>
}

export default Upload