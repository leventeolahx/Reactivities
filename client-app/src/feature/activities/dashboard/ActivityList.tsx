import React from 'react'
import { Item, Button, Label, Segment } from 'semantic-ui-react'
import { IActivity } from '../../../app/modules/activity'

interface IPorps {
    activities: IActivity[],
    selectActivity: (id: string) => void,
    deleteActivity: (id: string) => void;
}

const ActivityList: React.FC<IPorps> = ({
    activities,
    selectActivity,
    deleteActivity
}) => {
    
    return (
        <Segment clearing>
            <Item.Group divided>
                {activities.map(activity => (
                    <Item key={activity.id.toString()}>
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}</div>
                                <div>{activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button
                                    onClick={() => selectActivity(activity.id)}
                                    floated="right"
                                    content="View"
                                    color="blue"
                                />
                                <Button
                                    onClick={() => deleteActivity(activity.id)}
                                    floated="right"
                                    content="View"
                                    color="red"
                                />
                                <Label basic content={activity.category} />
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    );
}

export default ActivityList
