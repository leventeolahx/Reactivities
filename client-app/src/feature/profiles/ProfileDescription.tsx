import React, { useContext, useState } from 'react'
import { Tab, Grid, Header, Button } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileEditFrom from './ProfileEditFrom';
import { observer } from 'mobx-react-lite';

const ProfileDescription = () => {
    const rootStore = useContext(RootStoreContext);
    const { profile, isCurrentUser, updateProfile } = rootStore.profileStore;
    const [editMode, setEditMode] = useState(false);

    const handlerUpdateProfile = (values: any) => { 
        updateProfile(values);
        setEditMode(false);
    };

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16} style={{ paddingBottom: 0 }}>
                    <Header floated='left' icon='user' content={`About ${profile!.displayName}`} />
                    {isCurrentUser &&
                        <Button
                            floated='right'
                            basic
                            content={editMode ? 'Cancel' : 'Edit Profile'}
                            onClick={() => setEditMode(!editMode)}
                        />
                    }</Grid.Column>
                <Grid.Column width={16}>
                    {editMode ? (                        
                        <ProfileEditFrom
                            profile={profile!}
                            updateProfile={handlerUpdateProfile}
                        />
                    ) : (
                            <div>{profile!.bio}</div>  
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}

export default observer(ProfileDescription)
