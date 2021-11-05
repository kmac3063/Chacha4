import React from "react";
import {Button, Group, Panel, PanelHeader, PanelHeaderBack, Placeholder} from "@vkontakte/vkui";
import persik from "../img/persik.png";
import {Icon56UsersOutline} from "@vkontakte/icons";
import Choose from "./Choose";

const WelcomeScreen = ({id, fetchedUser, go}) => {
    const getName = (user) => {
        // if (user == null || user.first_name == null)
        //     return "Друже"
        // return fetchedUser.first_name
        return "Приятель"
    }

    return (
        <Panel id={id}>
            {/*<PanelHeader right={<Avatar size={36} />}>Panel 1</PanelHeader>*/}
            <Group>
                <Placeholder
                    icon={<Icon56UsersOutline />}
                    header={"Приветствуем, " + getName(fetchedUser) + "!"}
                    action={<Button size="m" onClick={go} data-to="Choose">Перейти к фонарику</Button>}
                >
                    Приложение разработано в рамках хакатона "Вездекод 2021"
                </Placeholder>
            </Group>
        </Panel>
    )
}

export default WelcomeScreen;