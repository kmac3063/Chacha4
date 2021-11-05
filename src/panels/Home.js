import React, {useEffect, useState} from 'react';

import {Avatar, Button, Cell, Div, Group, Header, Panel, PanelHeader, PanelHeaderBack, Switch} from '@vkontakte/vkui';
import bridge from "@vkontakte/vk-bridge";
import {doc, getDoc, setDoc} from "firebase/firestore/lite";
import {Icon28UserOutline} from "@vkontakte/icons";


const Home = ({id, go, fetchedUser, scheme, host, status, db}) => {
    const [currentSecond, setCurrentSecond] = useState(0)
    const [myInterval, setMyInterval] = useState(null)
    const [stateString, setStateString] = useState("00000000P")

    useEffect(() => {
        let connectTimer = null
        if (status === "connect") {
            if (host === null) {
                return
            }
            console.log(host)
            const docRef = doc(db, 'hs', host.id.toString())
            connectTimer = setInterval(() => {
                getDoc(docRef).then(snap => {
                    if (snap.exists()) {
                        console.log("snap.data().stateString: " + snap.data().stateString)
                        setStateString(() => snap.data().stateString)
                    }
                })
            }, 100)
        }
        return () => {
            if (connectTimer !== null) {
                clearInterval(connectTimer)
            }
            if (status === "host" && fetchedUser !== null) {
                setDoc(doc(db, 'hs', fetchedUser.id.toString()), {
                    stateString: stateString.slice(0, 8) + "P",
                })
            }
            bridge.send("VKWebAppFlashSetLevel", {"level": 0});
        }
    }, [])

    useEffect(() => {
        console.log("useEffect stateString:" + stateString)
        if (status === "host" && fetchedUser !== null) {
            setDoc(doc(db, 'hs', fetchedUser.id.toString()), {
                stateString: stateString,
            })
        }

        clearInterval(myInterval)
        if (stateString[stateString.length - 1] === "R") {
            run()
        } else {
            setCurrentSecond(0)
            bridge.send("VKWebAppFlashSetLevel", {"level": 0});
        }
    }, [stateString])

    const switchChange = (index, value) => {
        setStateString((prev1) => {
            let res = prev1.slice(0, index)
                + (prev1[index] === '1' ? '0' : '1') + prev1.slice(index + 1, 8) + "P"
            console.log(res)
            return res
        })
    }

    const startPressed = () => {
        setStateString((prev) => prev.slice(0, 8) + "R")
    }

    const stopPressed = () => {
        setStateString((prev) => prev.slice(0, 8) + "P")
    }

    const run = () => {
        let sec = 0
        setCurrentSecond(1)
        bridge.send("VKWebAppFlashSetLevel", {"level": parseInt(stateString[0])});
        let timerId = setInterval(() => {
            setCurrentSecond((prev) => 1 + (prev) % 8)
            sec = (sec + 1) % 8
            bridge.send("VKWebAppFlashSetLevel", {"level": parseInt(stateString[sec])});
        }, 1000);
        setMyInterval(timerId)
    }

    return <Panel id={id}>
        <PanelHeader
            left={<PanelHeaderBack onClick={go} data-to={'Choose'}/>}
        >{status === "host" ? "Диджей" : "Слушатель"}</PanelHeader>
        {status === "host" ?
            <Group>
                <Div style={{display: 'flex'}}>
                    <Button size="l" stretched style={{marginRight: 8}}
                            onClick={startPressed}>Начать</Button>
                    <Button size="l" stretched mode="secondary" onClick={stopPressed}>Остановить</Button>
                </Div>
            </Group> : <Group>
                <Header mode="secondary">Наш диджей</Header>
              <Cell before={<Avatar src={host !== null? host.photo_200 : ""}/>}>{host !== null? host.first_name + " " + host.last_name : "..."}</Cell>
            </Group>
        }
        <Group>
            <Header mode="secondary">Управление секундами</Header>
            <Div style={{display: "flex", justifyContent: "space-between", overflow: "auto"}}>
                {stateString.split('').map((symb, index) => {
                    if (symb !== '0' && symb !== '1') return null
                    return <Div key={index} style={{
                        padding: "0",
                        backgroundColor: index + 1 === currentSecond ? "#D7FDDB" : "#FFFFFF"
                    }}>
                        <Div style={{padding: "0"}}>{index + 1} сек</Div>
                        {status === "host" ?
                            <Switch checked={symb === "1"}
                                    onChange={(e) => switchChange(index, e.target.value)}/> :
                            <Switch checked={symb === "1"} disabled
                                    onChange={(e) => switchChange(index, e.target.value)}/>}
                    </Div>
                })
                }
            </Div>
        </Group>
        <Group>
            <Header mode="secondary">{status === "host" ? "Это ваша комната" : "Вы слушитель"}</Header>
            <Cell multiline>{status === "host" ?
                "Все подключившиеся к вам люди будут получать сигнал о включении фонарика в один момент с вами" :
                "Ждите, пока владелец комнаты включит вам фонарик!"
            }</Cell>
        </Group>
    </Panel>
}

export default Home;
