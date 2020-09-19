import React, { createContext, useState, useEffect } from "react";
import { withCookies } from "react-cookie";
import axios from "axios";

export const ApiContext = createContext();

const ApiContextProvider = (props) => {
  // ログイン時に正常にjwt-tokenが取得できていれば変数tokenに格納されてある
  const token = props.cookies.get("jwt-token");
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState(null);
  const [thum, setThum] = useState(null);
  // どのビデオが選択されているかの状態
  const [selectedVideo, setSelectedVideo] = useState(null);
  // modalが開いているのか閉じているのかの状態
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // 起動時に一番初めに発火されるuseEffect(token変更時再度useEffect発火)
  useEffect(() => {
    // 動画の一覧を取得する関数
    const getVideos = async () => {
      try {
        // 現在登録されてあるビデオの一覧をres変数に格納
        const res = await axios.get("http://localhost:8000/api/videos/", {
          headers: {
            Authorization: `JWT ${token}`,
          },
        });
        setVideos(res.data);
      } catch {
        console.log("error");
      }
    };
    getVideos();
  }, [token]);

  // 新規で動画を登録する関数
  const newVideo = async () => {
    // uploadData: バックエンドへ渡すデータの総合格納場所
    const uploadData = new FormData();
    // "title":左は属性であり、バックエンドで定義した値と一致してある事
    uploadData.append("title", title);
    uploadData.append("video", video, video.name);
    uploadData.append("thum", thum, thum.name);
    try {
      // uploadData(新規動画)をpost
      const res = await axios.post(
        "http://127.0.0.1:8000/api/videos/",
        uploadData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
        }
      );
      // 現在のvideo一覧を全分解し、新しく作成したres.data(新規動画データ)と一緒にsetVideosで格納
      setVideos([...videos, res.data]);
      // modalを閉じる
      setModalIsOpen(false);
      // タイトルリセット
      setTitle("");
      // ビデオデータリセット
      setVideo(null);
      // サムネデータリセット
      setThum(null);
    } catch {
      console.log("error");
    }
  };

  // 選択された動画を削除する関数
  const deleteVideo = async () => {
    try {
      // 選択している動画のidを指定し、動画を削除
      await axios.delete(
        `http://127.0.0.1:8000/api/videos/${selectedVideo.id}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
        }
      );
      // 動画選択を無しに
      setSelectedVideo(null);
      // 現在削除したビデオ以外をビデオ一覧(setVideos)に再セット
      setVideos(videos.filter((item) => item.id !== selectedVideo.id));
    } catch {
      console.log("error");
    }
  };

  // 動画にlikeが押された際の関数
  const incrementLike = async () => {
    try {
      // uploadData: バックエンドへ渡すデータの総合格納場所
      const uploadData = new FormData();
      // 現在選択されている動画のlikeに+1をしてuploadDataに格納
      uploadData.append("like", selectedVideo.like + 1);

      // 選択している動画のidを指定し、更新(uploadDataを渡して)
      const res = await axios.patch(
        `http://127.0.0.1:8000/api/videos/${selectedVideo.id}/`,
        uploadData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
        }
      );
      // 現在選択されているvideoを全分解し、新しく追加されたres.data.like(like+1)と一緒にsetSelectedVideosに格納
      setSelectedVideo({ ...selectedVideo, like: res.data.like });
      // 更新後の値で書き換え
      setVideos(
        videos.map((item) => (item.id === selectedVideo.id ? res.data : item))
      );
    } catch {
      console.log("error");
    }
  };

  // 動画にdislikeが押された際の関数
  const incrementDislike = async () => {
    try {
      // uploadData: バックエンドへ渡すデータの総合格納場所
      const uploadData = new FormData();
      // 現在選択されている動画のdislikeに+1をしてuploadDataに格納
      uploadData.append("dislike", selectedVideo.dislike + 1);
      // 選択している動画のidを指定し、更新(uploadDataを渡して)
      const res = await axios.patch(
        `http://127.0.0.1:8000/api/videos/${selectedVideo.id}/`,
        uploadData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
        }
      );
      // 現在選択されているvideoを全分解し、新しく追加されたres.data.dislike(dislike+1)と一緒にsetSelectedVideosに格納
      setSelectedVideo({ ...selectedVideo, dislike: res.data.dislike });
      // 更新後の値で書き換え
      setVideos(
        videos.map((item) => (item.id === selectedVideo.id ? res.data : item))
      );
    } catch {
      console.log("error");
    }
  };

  // 他のコンポーネントでも関数やstate等を再利用できるようにする(createContextを使用)
  return (
    <ApiContext.Provider
      value={{
        videos,
        title,
        setTitle,
        video,
        setVideo,
        thum,
        setThum,
        selectedVideo,
        setSelectedVideo,
        modalIsOpen,
        setModalIsOpen,
        newVideo,
        deleteVideo,
        incrementLike,
        incrementDislike,
      }}
    >
      {/* divダグ等にも対応させるため(ひとまず記入しておけば安心) */}
      {props.children}
    </ApiContext.Provider>
  );
};

export default withCookies(ApiContextProvider);
