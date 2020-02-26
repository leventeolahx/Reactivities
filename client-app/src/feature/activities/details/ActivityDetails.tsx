import React from 'react'
import { Card, Image, Button } from 'semantic-ui-react'
import { IActivity } from '../../../app/modules/activity'

interface IPrps {
    activity: IActivity,
    setEditMode: (editMode: boolean) => void,
    setSelectedActivity: (activity: IActivity | null) => void,
}

const ActivityDetails: React.FC<IPrps> = ({ activity, setEditMode, setSelectedActivity }) => {
    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${activity.category}.jpg`} wrapped ui={false} />
            <Card.Content>
                <Card.Header>{activity.title}</Card.Header>
                <Card.Meta>
                    <span>{activity.date}</span>
                </Card.Meta>
                <Card.Description>
                    {activity.description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths={2}>
                    <Button onClick={() => setEditMode(true)} basic colort='blue'>Edit</Button>
                    <Button onClick={() => setSelectedActivity(null)} basic colort='gray'>Cancel</Button>
                </Button.Group>
            </Card.Content>
        </Card>
    )
}

export default ActivityDetails
