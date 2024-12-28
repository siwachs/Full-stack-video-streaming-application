// Core Library is FFmpeg https://www.ffmpeg.org
// This is a standalone library use in every video streaming and images (YT, Netflix ...)

// Example of FFmpeg: ffmpeg -i input.mp4 output.avi

// https://www.cloudflare.com/en-gb/learning/video/what-is-http-live-streaming

// Video Processing:

// Video on Server --> Convert it in 240p, 360p, 480p, 720p, 1080p ...
// Now switch to those p's --> In that case we have to downlad that whole video again

// Segmentation: Solution is video Chunks ie (Adaptive Streaming) considering videos are frames 24fps.
// We have (frames or segments) for each videos

// HTTP Live Streaming (HSL) AKS adaptive bitrate video delivery ...

// m3u8 -> It is a UTF-8 encoded playlist file. It is not video file it is index file. They are plain text files used to store the URL paths of straming audio or video and information about the media track. (ie timestamps)

// codecs (short for compressor-decompressor) are algorithms or software used to compress and decompress video files. They play a crucial role in reducing the file size of videos while maintaining as much quality as possible, and enabling efficient storage, transmission, and playback.
