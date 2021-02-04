import React, { useState, useEffect } from 'react'
import ReactPlayer from 'react-player'

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import Loading from './Loading';

const ffmpeg = createFFmpeg();


const GifSection = () => {

    const [video, setVideo] = useState();
    const [ready, setReady] = useState(false);
    const [gif, setGif] = useState()
    const load = async () => {
        await ffmpeg.load();
        setReady(true);
    }

    useEffect(() => {
        load();

    }, []);


    const convertToGif = async () => {
        //write file to memory
        ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));

        // Run the FFMpeg command
        await ffmpeg.run('-i', 'test.mp4', '-t', '5.0', '-ss', '2.0', '-f', 'gif', 'out.gif');

        // Read the result
        const data = ffmpeg.FS('readFile', 'out.gif');
        const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));

        setGif(url);
    }

    return ready ? (
        <section className="final-gif">

            {gif ? <img src={gif} width="352" alt="gif"></img> : <div className={'gif-section'}>

                {
                    video ? <ReactPlayer url={URL.createObjectURL(video)} width='352px' height='240px' /> : <section className="upload-video">
                        <label >Upload a video file</label>
                        {/* <input className={'inputfile'} type="file" onChange={(e)=> setVideo(e.target.files?.item(0))}></input> */}

                        <div className={'button-wrapper'}>

                            <span className={'label'}>
                                Upload Video
                      </span>

                            <input type="file" className={'upload-box upload'} placeholder="Upload File" onChange={(e) => setVideo(e.target.files?.item(0))} />

                        </div>
                    </section>
                }


                <button className={'btn-convert'} onClick={convertToGif}>Convert</button>
            </div>}
        </section>

    ) : <Loading />;
}

export default GifSection
