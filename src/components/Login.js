import React, { useReducer } from "react";
import { withCookies } from "react-cookie";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  START_FETCH,
  FETCH_SUCCESS,
  ERROR_CATCHED,
  INPUT_EDIT,
  TOGGLE_MODE,
} from "./actionTypes";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3),
  },
  span: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "teal",
  },
  spanError: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "fuchsia",
    marginTop: 10,
  },
}));

// 初期状態
const initialState = {
  // load中かのstate
  isLoading: false,
  // loginViewか否かのstate
  isLoginView: true,
  // errorの状態(何も無ければ空)state
  error: "",
  // 認証の情報を保有するstate
  credentialsLog: {
    email: "",
    password: "",
  },
};

// 各アクションによるinitialStateの更新
const loginReducer = (state, action) => {
  switch (action.type) {
    // バックエンドのAPIにアクセス開始
    case START_FETCH: {
      return {
        // stateを分解
        ...state,
        // isLoadingを更新
        isLoading: true,
      };
    }
    // アクセス成功
    case FETCH_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }
    // アクセス失敗
    case ERROR_CATCHED: {
      return {
        ...state,
        error: "Email or password is not correct !",
        isLoading: false,
      };
    }
    // FORMのtextが変更される度に呼び出される
    case INPUT_EDIT: {
      return {
        ...state,
        [action.inputName]: action.payload,
        error: "",
      };
    }
    // ログインと新規作成の切り替え
    case TOGGLE_MODE: {
      return {
        ...state,
        isLoginView: !state.isLoginView,
      };
    }
    default:
      return state;
  }
};

const Login = (props) => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(loginReducer, initialState);

  // 入力フォームの状態保存関数
  const inputChangedLog = () => (event) => {
    const cred = state.credentialsLog;
    cred[event.target.name] = event.target.value;
    dispatch({
      type: INPUT_EDIT,
      inputName: "state.credentialLog",
      payload: cred,
    });
  };

  // ログインまたは新規作成のボタンが押された際の関数
  const login = async (event) => {
    // ページリフレッシュ防止
    event.preventDefault();
    // ログインの場合
    if (state.isLoginView) {
      try {
        dispatch({ type: START_FETCH });
        const res = await axios.post(
          `http://127.0.0.1:8000/authen/jwt/create/`,
          state.credentialsLog,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        // res.data.accessにjwtのtokenが入っており,cookieのメソッドのsetを使用し、変数jwt-tokenに格納している
        props.cookies.set("jwt-token", res.data.access);
        res.data.access
          ? (window.location.href = "/youtube")
          : (window.location.href = "/");
        dispatch({ type: FETCH_SUCCESS });
      } catch {
        dispatch({ type: ERROR_CATCHED });
      }
      // 新規作成の場合
    } else {
      try {
        dispatch({ type: START_FETCH });
        await axios.post(
          `http://127.0.0.1:8000/api/create/`,
          state.credentialsLog,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const res = await axios.post(
          `http://127.0.0.1:8000/authen/jwt/create/`,
          state.credentialsLog,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        props.cookies.set("jwt-token", res.data.access);
        res.data.access
          ? (window.location.href = "/youtube")
          : (window.location.href = "/");
        dispatch({ type: FETCH_SUCCESS });
      } catch {
        dispatch({ type: ERROR_CATCHED });
      }
    }
  };

  // ログインと新規作成を入れ替える関数
  const toggleView = () => {
    dispatch({ type: TOGGLE_MODE });
  };

  return (
    <Container maxWidth="xs">
      <form onSubmit={login}>
        <div className={classes.paper}>
          {state.isLoading && <CircularProgress />}
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5">
            {state.isLoginView ? "Login" : "Register"}
          </Typography>

          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Email"
            name="email"
            value={state.credentialsLog.email}
            onChange={inputChangedLog()}
            autoFocus
          />

          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="password"
            value={state.credentialsLog.password}
            onChange={inputChangedLog()}
            label="Password"
            type="password"
          />

          <span className={classes.spanError}>{state.error}</span>

          {state.isLoginView ? (
            !state.credentialsLog.password || !state.credentialsLog.email ? (
              <Button
                className={classes.submit}
                type="submit"
                fullWidth
                disabled
                variant="contained"
                color="primary"
              >
                Login
              </Button>
            ) : (
              <Button
                className={classes.submit}
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Login
              </Button>
            )
          ) : !state.credentialsLog.password || !state.credentialsLog.email ? (
            <Button
              className={classes.submit}
              type="submit"
              fullWidth
              disabled
              variant="contained"
              color="primary"
            >
              Register
            </Button>
          ) : (
            <Button
              className={classes.submit}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Register
            </Button>
          )}

          <span onClick={() => toggleView()} className={classes.span}>
            {state.isLoginView ? "Create Account" : "Back to login"}
          </span>
        </div>
      </form>
    </Container>
  );
};

export default withCookies(Login);
