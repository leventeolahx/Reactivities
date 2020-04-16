import React from 'react'
import { Grid, Segment, Form, Button } from 'semantic-ui-react'
import { Field, Form as FinalForm } from 'react-final-form'
import TextInput from '../../app/common/from/TextInput'
import TextAreaInput from '../../app/common/from/TextAreaInput'
import { combineValidators, isRequired } from 'revalidate'
import { observer } from 'mobx-react-lite'
import { IProfile } from '../../app/models/profile'

const validate = combineValidators({
    displayName: isRequired({ message: 'The profile display is required' }),
  })

interface IProps {
    profile: IProfile;
    updateProfile: (values: any) => void;
}

const ProfileEditFrom: React.FC<IProps> = ({ profile, updateProfile }) => {
    return (
        <Grid>
            <Grid.Column >
                <Segment clearing>
                    <FinalForm
                        validate={validate}
                        initialValues={profile!}
                        onSubmit={updateProfile}
                        render={({ handleSubmit, invalid, pristine, submitting }) => (
                            <Form onSubmit={handleSubmit} error>
                                <Field
                                    name='displayName'
                                    placeholder='Display Name'
                                    value={profile!.displayName}
                                    component={TextInput}
                                />
                                <Field
                                    name='bio'
                                    rows={3}
                                    placeholder='Bio'
                                    value={profile!.bio}
                                    component={TextAreaInput}
                                />

                                <Button
                                    loading={submitting}
                                    disabled={invalid || pristine}
                                    floated='right'
                                    positive
                                    type='submit'
                                    content='Update profile'
                                ></Button>
                            </Form>
                        )}
                    />
                </Segment>
            </Grid.Column>
        </Grid>
    )
}

export default observer(ProfileEditFrom)
