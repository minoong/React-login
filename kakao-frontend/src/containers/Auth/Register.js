import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { isEmail, isLength, isAlphanumeric } from "validator";
import debounce from "lodash/debounce";
import {
  AuthContent,
  InputWithLabel,
  AuthButton,
  RightAlignedLink,
  AuthError,
} from "../../components/Auth";
import {
  changeInput,
  initializeForm,
  setError,
  checkEmailExists,
  checkUsernameExists,
  localRegister,
} from "../../redux/modules/auth";
import storage from "../../lib/storage";

const Register = ({ history }) => {
  const { email, username, password, passwordConfirm } = useSelector(
    ({ auth }) => {
      return auth.getIn(["register", "form"]).toJS();
    }
  );
  const { error } = useSelector(({ auth }) => {
    return auth.getIn(["form"]).toJS();
  });
  const { result } = useSelector(({ auth }) => {
    return auth.getIn(["result"]).toJS();
  });
  const exists = useSelector(({ auth }) => {
    return auth.getIn(["register", "exists"]);
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;

    dispatch(
      changeInput({
        name,
        value,
        form: "register",
      })
    );

    const validation = validate[name](value);
    const check = name === "email" ? onEmailExists : onUsernameExists;
    check(value);
    if (name.indexOf("password") > -1 || validation) {
      return;
    }
  };

  const handleLocalRegister = async () => {
    if (error) return;

    if (
      !validate["email"](email) ||
      !validate["username"](username) ||
      !validate["password"](password) ||
      !validate["passwordConfirm"](passwordConfirm)
    ) {
      return;
    }

    try {
      await localRegister({
        email,
        username,
        password,
      });

      const loggedInfo = result;

      console.log(loggedInfo);

      storage.set("loggedInfo", loggedInfo);

      history.push("/");
    } catch (e) {
      if (e.response.status === 400) {
        const { key } = e.reponse.data;
        const message =
          key === "email"
            ? "이미 존재하는 이메일 입니다."
            : "이미 존재하는 아이디 입니다.";
        return onError(message);
      }
    }
  };

  const onError = (message) => {
    dispatch(
      setError({
        form: "register",
        message,
      })
    );
  };

  useEffect(() => {
    return () => {
      dispatch(initializeForm("register"));
    };
  }, [dispatch]);

  const validate = {
    email: (value) => {
      if (!isEmail(value)) {
        onError("잘못된 이메일 형식 입니다.");
        return false;
      }
      return true;
    },
    username: (value) => {
      if (!isAlphanumeric(value) || !isLength(value, { min: 4, max: 15 })) {
        onError("아이디는 4~15 글자의 알파벳 혹은 숫자로 이루어져야 합니다.");
        return false;
      }
      return true;
    },
    password: (value) => {
      if (!isLength(value, { min: 6 })) {
        onError("비밀번호를 6자 이상 입력하세요.");
        return false;
      }
      onError(null);
      return true;
    },
    passwordConfirm: (value) => {
      if (password !== value) {
        onError("비밀번호 확인이 일치하지 않습니다.");
        return false;
      }
      onError(null);
      return true;
    },
  };

  const onEmailExists = debounce(async (email) => {
    try {
      await checkEmailExists(email);

      if (exists.get("email")) {
        onError("이미 존재하는 이메일 입니다.");
      } else {
        onError(null);
      }
    } catch (e) {
      console.error(e);
    }
  }, 3000);
  const onUsernameExists = debounce(async (username) => {
    try {
      await checkUsernameExists(username);

      if (exists.get("username")) {
        onError("이미 존재하는 아이디 입니다.");
      } else {
        onError(null);
      }
    } catch (e) {
      console.error(e);
    }
  }, 3000);

  return (
    <AuthContent title="회원가입">
      <InputWithLabel
        label="이메일"
        name="email"
        placeholder="이메일"
        value={email}
        onChange={handleChange}
      />
      <InputWithLabel
        label="아이디"
        name="username"
        placeholder="아이디"
        value={username}
        onChange={handleChange}
      />
      <InputWithLabel
        label="비밀번호"
        name="password"
        placeholder="비밀번호"
        type="password"
        value={password}
        onChange={handleChange}
      />
      <InputWithLabel
        label="비밀번호확인"
        name="passwordConfirm"
        placeholder="비밀번호확인"
        type="password"
        value={passwordConfirm}
        onChange={handleChange}
      />
      {error && <AuthError>{error}</AuthError>}
      <AuthButton onClick={handleLocalRegister}>회원가입</AuthButton>
      <RightAlignedLink to="/auth/login">로그인</RightAlignedLink>
    </AuthContent>
  );
};

export default React.memo(Register);
