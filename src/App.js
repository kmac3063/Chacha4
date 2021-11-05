import React, {useEffect, useState} from 'react';
import bridge from '@vkontakte/vk-bridge';
import {AdaptivityProvider, AppRoot, ScreenSpinner, View} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import WelcomeScreen from "./panels/WelcomeScreen";
import Choose from "./panels/Choose";

import {initializeApp} from "firebase/app";
import {getFirestore} from 'firebase/firestore/lite';

const App = () => {
    const [activePanel, setActivePanel] = useState('Choose');
    const [fetchedUser, setUser] = useState(null);
    const [popout, setPopout] = useState(<ScreenSpinner size='large'/>);
    const [scheme, setScheme] = useState(null)
    const [friend, setFriend] = useState(null)
    const [status, setStatus] = useState("connect")

    // const schemeAttribute = document.createAttribute('scheme');
    // schemeAttribute.value = 'dark';
    // document.body.attributes.setNamedItem(schemeAttribute);
    const d = false

    const firebaseConfig = {
        apiKey: "AIzaSyA4pTIWp427xU-6UKZhMS5gm7jgZpnjTaM",
        authDomain: "chacha4-45297.firebaseapp.com",
        projectId: "chacha4-45297",
        storageBucket: "chacha4-45297.appspot.com",
        messagingSenderId: "908778198952",
        appId: "1:908778198952:web:a3d68cc210e47a638aaf9d"
    };

    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp)

    useEffect(() => {
        bridge.subscribe(({detail: {type, data}}) => {
            if (type === 'VKWebAppUpdateConfig') {
                const schemeAttribute = document.createAttribute('scheme')
                // schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
                schemeAttribute.value = 'client_light';
                setScheme(schemeAttribute.value)
                document.body.attributes.setNamedItem(schemeAttribute);
            }
        });

        async function fetchData() {
            setPopout(null);
            const user = await bridge.send('VKWebAppGetUserInfo');
            setUser(user);
        }

        async function checkAvailable() {
            bridge.send("VKWebAppFlashGetInfo").then(
                (p) => {
                    if (!p.is_available) {
                        alert("На вашем устройстве отсутствует/не работает фонарик :(")
                    }
                }
            )
        }


        fetchData();
        checkAvailable()
    }, []);

    const go = e => {
        setActivePanel(e.currentTarget.dataset.to);
    };

    const connect = () => {
        bridge.send('VKWebAppGetFriends', {}).then(data => {
            setFriend(() => data.users[0])
            setStatus("connect")
            setActivePanel(() => 'Home')
        })

        if (d) {
            let a = {
                "id": 1,
                "first_name": "Albert",
                "last_name": "Usmanov",
                "sex": 2,
                "photo_200": "https://sun1-86.userapi.com/s/v1/ig2/0mApXKbszoZQ_5V-YXS7rD54TDPTxn8xu9XbmzfkWCxn3yxb54W8ErTcyXqqApWMBPEqA0ZLVjcfF_J3hTpOT-5X.jpg?size=50x50&quality=95&crop=584,681,359,359&ava=1"
            }

            setUser({id: 0})
            setFriend(() => a)
            setStatus("connect")
            setActivePanel(() => 'Home')
        }
    }

    const host = () => {
        setStatus("host")
        setActivePanel(() => 'Home')
        setFriend(() => null)

        if (d) {
            setUser({id: 0})
        }
    }

    return (
        <AdaptivityProvider>
            <AppRoot>
                <View activePanel={activePanel} popout={popout}>
                    <WelcomeScreen id='WelcomeScreen' fetchedUser={fetchedUser} go={go}/>
                    <Choose id='Choose' fetchedUser={fetchedUser} go={go} connect={connect} host={host}/>
                    <Home id='Home' fetchedUser={fetchedUser} setActivePanel={setActivePanel}
                          host={friend} status={status} db={db}
                    />
                </View>
            </AppRoot>
        </AdaptivityProvider>
    );
}

export default App;
