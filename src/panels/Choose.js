import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import {
    Panel,
    PanelHeader,
    Header,
    Button,
    Group,
    Cell,
    Div,
    Avatar,
    SimpleCell,
    Switch,
    FormItem, Select
} from '@vkontakte/vkui';
import bridge from "@vkontakte/vk-bridge";

const Choose = ({id, go, fetchedUser, scheme, connect, host}) => {
    useEffect(() => {
        console.log("Choose")
        bridge.send("VKWebAppFlashSetLevel", {"level": 0});
    }, [])
    return <Panel id={id}>
        <PanelHeader>Один-ноль фонарик</PanelHeader>
        <Group>
            <Div style={{display: 'flex'}}>
                <Button size="l" stretched style={{marginRight: 8}} onClick={connect} data-to={"Home"}>Подключиться</Button>
                <Button size="l" stretched mode="secondary" onClick={host} data-to={"Home"}>Быть диджеем</Button>
            </Div>
        </Group>
    </Panel>
}

export default Choose;
