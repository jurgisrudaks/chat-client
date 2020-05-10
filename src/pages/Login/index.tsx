import React, { useState, useContext } from 'react';
import Spinner from '../../common/components/Spinner';

import { UserContext, ErrorContext } from '../../App';

import buttonStyles from '../../common/styles/Button.module.scss';
import styles from './styles/Login.module.scss';

enum LoginResponseStatus {
  'OK' = 200,
  'INVALID_USERNAME' = 400,
  'USERNAME_TAKEN' = 401,
}

const LoginPage: React.FC = () => {
  const { setUser } = useContext(UserContext);
  const { error, setError } = useContext(ErrorContext);

  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const unhandledErrorCaught = (): void => {
    if (setError) {
      setError('Oops. Something went wrong, please try again later.');
    }
  };

  const processLoginResponse = async (response: Response): Promise<void> => {
    const unknownResponseStatus = !Object.values(LoginResponseStatus).includes(
      response.status
    );

    if (!response || (response && unknownResponseStatus)) {
      unhandledErrorCaught();
      setIsLoading(false);

      return;
    }

    if (response.status === LoginResponseStatus.OK) {
      try {
        const user = await response.json();

        if (setUser) {
          setUser(user);
        }
      } catch (e) {
        unhandledErrorCaught();
        setIsLoading(false);
      }
    }

    if (response.status === LoginResponseStatus.INVALID_USERNAME) {
      if (setError) {
        setError('Username must be at least 3 characters long.');
      }
      setIsLoading(false);
    }

    if (response.status === LoginResponseStatus.USERNAME_TAKEN) {
      if (setError) {
        setError('Username already taken.');
      }
      setIsLoading(false);
    }
  };

  const login = async (): Promise<void> => {
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_URL
            ? `${process.env.REACT_APP_API_URL}`
            : ''
        }/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
          }),
        }
      );

      processLoginResponse(response);
    } catch (e) {
      if (setError) {
        setError('Server unavailable, please try again later.');
      }
      setIsLoading(false);
    }
  };

  const onUsernameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (error && setError) {
      setError(null);
    }

    setUsername(event.target.value);
  };

  const onLogin = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    setIsLoading(true);

    if (setError) {
      setError(null);
    }

    login();
  };

  return (
    <div className={styles.container}>
      <div className={styles['image-container']}>
        <div className={styles['image-inner-container']}>
          <svg
            viewBox="0 -26 512 512"
            xmlns="http://www.w3.org/2000/svg"
            style={{ fill: '#eee' }}
          >
            <path d="M256 100c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm0 0M90 280c5.52 0 10-4.48 10-10s-4.48-10-10-10-10 4.48-10 10 4.48 10 10 10zm0 0" />
            <path d="M336 0c-90.027 0-163.918 62.07-169.633 140.254C80.63 144.554 0 206.379 0 290c0 34.945 13.828 68.805 39 95.633 4.98 20.531-1.066 42.293-16.07 57.297A9.998 9.998 0 0030 460c28.52 0 56.004-11.184 76.426-30.89C126.32 435.89 152.277 440 176 440c90.016 0 163.898-62.055 169.629-140.223 20.937-.93 42.715-4.797 59.945-10.668C425.996 308.816 453.48 320 482 320a9.998 9.998 0 007.07-17.07c-15.004-15.004-21.05-36.766-16.07-57.297 25.172-26.828 39-60.688 39-95.633C512 63.113 425.16 0 336 0zM176 420c-23.602 0-50.496-4.633-68.512-11.8a10 10 0 00-11.078 2.538c-12.074 13.2-27.773 22.403-44.879 26.633a80.872 80.872 0 006.098-59.52 9.98 9.98 0 00-2.445-4.226C32.496 350.258 20 320.559 20 290c0-70.469 71.438-130 156-130 79.852 0 150 55.527 150 130 0 71.684-67.29 130-150 130zm280.816-186.375a10.027 10.027 0 00-2.445 4.227 80.872 80.872 0 006.098 59.52c-17.106-4.227-32.805-13.435-44.88-26.634a10.007 10.007 0 00-11.077-2.539c-15.614 6.211-37.887 10.512-58.914 11.551-2.922-37.816-21.786-73.36-54.036-99.75H422c5.523 0 10-4.477 10-10s-4.477-10-10-10H260.84c-22.7-11.555-48.188-18.293-74.422-19.707C192.164 73.129 257.058 20 336 20c84.563 0 156 59.531 156 130 0 30.559-12.496 60.258-35.184 83.625zm0 0" />
            <path d="M256 260H130c-5.523 0-10 4.477-10 10s4.477 10 10 10h126c5.523 0 10-4.477 10-10s-4.477-10-10-10zm0 0M256 320H90c-5.523 0-10 4.477-10 10s4.477 10 10 10h166c5.523 0 10-4.477 10-10s-4.477-10-10-10zm0 0M422 100H296c-5.523 0-10 4.477-10 10s4.477 10 10 10h126c5.523 0 10-4.477 10-10s-4.477-10-10-10zm0 0" />
          </svg>
        </div>
      </div>

      <div className={styles['form-container']}>
        {error && (
          <div className={styles.error}>
            <div className={styles['error-icon']}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                style={{ width: '100%', height: '100%' }}
              >
                <path d="M501.609 384.603L320.543 51.265c-13.666-23.006-37.802-36.746-64.562-36.746-26.76 0-50.896 13.74-64.562 36.746-.103.176-.19.352-.293.528L10.662 384.076c-13.959 23.491-14.223 51.702-.719 75.457 13.535 23.769 37.919 37.948 65.266 37.948h360.544c27.347 0 52.733-14.179 66.267-37.948 13.504-23.754 13.241-51.967-.411-74.93zM225.951 167.148c0-16.586 13.445-30.03 30.03-30.03 16.586 0 30.03 13.445 30.03 30.03v120.121c0 16.584-13.445 30.03-30.03 30.03s-30.03-13.447-30.03-30.03V167.148zm30.03 270.273c-24.839 0-45.046-20.206-45.046-45.046 0-24.839 20.206-45.045 45.046-45.045 24.839 0 45.045 20.206 45.045 45.045.001 24.839-20.205 45.046-45.045 45.046z" />
              </svg>
            </div>
            <div>{error}</div>
          </div>
        )}
        <form className={styles.form} onSubmit={onLogin}>
          <input
            data-testid="login-username-input"
            className={styles['username-input']}
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={onUsernameChange}
            required
            minLength={3}
          />
          <button
            data-testid="login-submit-btn"
            className={`${buttonStyles.button} ${styles['submit-button']}`}
            type="submit"
          >
            Join chat
          </button>
        </form>
        <Spinner
          hidden={!isLoading}
          overlay
          overlayColor="rgb(236, 236, 236)"
        />
      </div>
    </div>
  );
};

export default LoginPage;
