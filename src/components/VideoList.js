import React, { useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import Grid from "@material-ui/core/Grid";
import VideoItem from "./VideoItem";

const VideoList = () => {
  const { videos } = useContext(ApiContext);
  // ビデオ一覧をmapで展開し、VideoItemに渡し、listOfVideos変数に格納
  const listOfVideos = videos.map((video) => (
    <VideoItem key={video.id} video={video} />
  ));
  return (
    <Grid container spacing={5}>
      <div className="video-list">{listOfVideos}</div>
    </Grid>
  );
};

export default VideoList;
