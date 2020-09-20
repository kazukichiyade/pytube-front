import React, { useContext } from "react";
import { ApiContext } from "../context/ApiContext";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import DeleteIcon from "@material-ui/icons/Delete";
import ReactPlayer from "react-player";

import { AiFillLike } from "react-icons/ai";
import { AiFillDislike } from "react-icons/ai";
import { IoLogoYoutube } from "react-icons/io";

const useStyles = makeStyles((theme) => ({
  title: {
    paddingLeft: theme.spacing(2),
  },
  delete: {
    margin: theme.spacing(2),
  },
  like: {
    paddingTop: theme.spacing(3),
  },
}));

const VideoDetail = () => {
  const classes = useStyles();
  const {
    selectedVideo,
    deleteVideo,
    incrementLike,
    incrementDislike,
  } = useContext(ApiContext);

  // 何もビデオが選択されていない場合の時(setSelectedVideoがfalseの時)
  if (!selectedVideo)
    return (
      <div className="container">
        <button className="wait">
          <IoLogoYoutube />
        </button>
      </div>
    );

  // ビデオが選択されている時(setSelectedVideoがtrueの時)
  return (
    <>
      <div className="wrapper">
        <ReactPlayer
          className="player"
          // 選択されているビデオ
          url={selectedVideo.video}
          width="100%"
          height="100%"
          // 自動でビデオが始まる
          playing
          // 再生ボタンや停止ボタンが表示される
          controls
          // スクリーンショットを撮る機能をdisabled
          disablePictureInPicture
          // 動画を保存する機能を無効化
          config={{
            file: {
              attributes: {
                controlsList: "nodownload",
                disablePictureInPicture: true,
              },
            },
          }}
        />
      </div>
      <Grid container alignItems="center">
        {/* 動画のタイトル */}
        <Grid item xs={10}>
          <Typography className={classes.title} variant="h6">
            {selectedVideo.title}
          </Typography>
        </Grid>

        {/* 動画のlike機能 */}
        <Grid item xs={1}>
          <button className="like" onClick={() => incrementLike()}>
            <AiFillLike />
            <Typography>{selectedVideo.like}</Typography>
          </button>
        </Grid>

        {/* 動画のdislike機能 */}
        <Grid item xs={1}>
          <button className="like" onClick={() => incrementDislike()}>
            <AiFillDislike />
            <Typography>{selectedVideo.dislike}</Typography>
          </button>
        </Grid>
      </Grid>

      {/* ビデオの削除ボタン */}
      <Fab
        className={classes.delete}
        color="primary"
        aria-label="delete"
        onClick={() => deleteVideo()}
      >
        <DeleteIcon />
      </Fab>
    </>
  );
};

export default VideoDetail;
