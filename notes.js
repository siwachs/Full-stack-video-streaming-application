// Core Library is FFmpeg https://www.ffmpeg.org
// This is a standalone library use in every video streaming and images (YT, Netflix ...)

// Example of FFmpeg: ffmpeg -i input.mp4 output.avi

// https://www.cloudflare.com/en-gb/learning/video/what-is-http-live-streaming

// Video Processing:

// Video on Server --> Convert it in 240p, 360p, 480p, 720p, 1080p ...
// Now switch to those p's --> In that case we have to downlad that whole video again

// Solution is video Chunks ie (Adaptive Streaming) considering videos are frames 24fps.
// We have (frames or segments) for each videos

// HTTP Live Streaming (HSL) AKS adaptive bitrate video delivery ...
