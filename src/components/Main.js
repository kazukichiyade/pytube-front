import React, { useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import Modal from "react-modal";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";

import { IoMdClose } from "react-icons/io";
import { RiUploadCloud2Line } from "react-icons/ri";
import { FaVideo } from "react-icons/fa";
import { BsImages } from "react-icons/bs";

import VideoList from "./VideoList";
import VideoDetail from "./VideoDetail";

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: "center",
  },
  grid: {
    justifyContent: "center",
  },
}));

const Main = () => {
  const classes = useStyles();
  Modal.setAppElement("#root");
  const {
    title,
    setTitle,
    video,
    setVideo,
    thum,
    setThum,
    modalIsOpen,
    setModalIsOpen,
    newVideo,
  } = useContext(ApiContext);

  const customStyles = {
    content: {
      top: "30%",
      left: "43%",
      right: "auto",
      bottom: "auto",
    },
  };

  // 動画選択ダイアログが立ち上がる
  const handleEditMovie = () => {
    const fileInput = document.getElementById("mp4Input");
    fileInput.click();
  };

  // 画像選択ダイアログが立ち上がる
  const handleEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };

  return (
    <>
      <Grid container className={classes.grid}>
        <Grid item xs={11}>
          <Grid container spacing={5}>
            <Grid item xs={12}></Grid>

            {/* 新規作成のボタン */}
            <Grid item xs={1}>
              <Fab
                color="primary"
                aria-label="add"
                onClick={() => setModalIsOpen(true)}
              >
                <AddIcon />
              </Fab>
            </Grid>

            {/* 選択されたビデオ */}
            <Grid item xs={8}>
              <VideoDetail />
            </Grid>

            {/* ビデオ一覧 */}
            <Grid item xs={3}>
              <VideoList />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Modal
        isOpen={modalIsOpen}
        // modal以外の余白等をクリックしてもmodalを閉じるように
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
      >
        {/* タイトル */}
        <Typography>Movie title</Typography>
        <br />

        {/* TextField入力時タイトルのstateを更新 */}
        <TextField
          type="text"
          onChange={(event) => setTitle(event.target.value)}
        />
        <br />
        <br />
        <Container className={classes.container}>
          {/* 動画のinputForm */}
          <input
            type="file"
            id="mp4Input"
            hidden="hidden"
            // 上げようとしている動画ファイルをsetVideoに格納
            onChange={(event) => setVideo(event.target.files[0])}
          />

          {/* materialUIのボタンをクリックすると、動画選択ダイアログが立ち上がる */}
          <IconButton onClick={handleEditMovie}>
            <FaVideo className="photo" />
          </IconButton>

          {/* サムネイルのinputForm */}
          <input
            type="file"
            id="imageInput"
            hidden="hidden"
            // 上げようとしている画像ファイルをsetThumに格納
            onChange={(event) => setThum(event.target.files[0])}
          />

          {/* materialUIのボタンをクリックすると、画像選択ダイアログが立ち上がる */}
          <IconButton onClick={handleEditPicture}>
            <BsImages className="photo" />
          </IconButton>
          <br />

          {/* タイトル、ビデオ、サムネイル全てが揃っている時にuploadボタンを押す事ができる */}
          {title && video && thum && (
            <button className="btn-modal" onClick={() => newVideo()}>
              <RiUploadCloud2Line />
            </button>
          )}
          {/* modalを閉じるボタン */}
          <button className="btn-modal" onClick={() => setModalIsOpen(false)}>
            <IoMdClose />
          </button>
        </Container>
      </Modal>
    </>
  );
};

export default Main;
