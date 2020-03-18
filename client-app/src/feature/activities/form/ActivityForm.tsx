import React, { useState, useContext, useEffect } from 'react';
import { Segment, Form, Button, Grid, FormGroup } from 'semantic-ui-react';
import {
  ActivityFormValues
} from '../../../app/modules/activity';
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../../app/common/from/TextInput';
import TextAreaInput from '../../../app/common/from/TextAreaInput';
import SelectInput from '../../../app/common/from/SelectInput';
import DateInput from '../../../app/common/from/DateInput';
import { category } from '../../../app/common/options/categoryOptions';
import { combineDateAndTime } from '../../../app/common/util/util';
import { combineValidators, isRequired, composeValidators, hasLengthGreaterThan } from 'revalidate';

const validate = combineValidators({
  title: isRequired({message: 'The event title is required'}),
  category: isRequired('Category'),
  description: composeValidators(
    isRequired('Description'),
    hasLengthGreaterThan(4)({ message: 'Description needs to be at least 5 characters' }),    
  )(),
  city: isRequired('City'),
  venue: isRequired('Venue'),
  date: isRequired('Date'),
  time: isRequired('Time'),
})

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history
}) => {
  const activityStore = useContext(ActivityStore);
  const {
    createActivity,
    editActivity,
    submitting,
    loadActivity,
  } = activityStore;

  const [activity, setActivity] = useState(new ActivityFormValues());
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadActivity(match.params.id)
        .then(
          // initialFormState us undefined when the page first loads
          // then we load loadActivity and that sets the activity in the store
          // which updates the cmp
          // so the activity will be displayed
          activity => setActivity(new ActivityFormValues(activity))
        )
        .finally(() => setLoading(false));
    }
  }, [loadActivity, match.params.id]);

  const handleFinalFormSubmit = (values: any) => {
    const dateAndTime = combineDateAndTime(values.date, values.time);
    const { date, time, ...activity } = values;
    activity.date = dateAndTime;

    if (!activity.id) {
      let newActivity = {
        ...activity,
        id: uuid()
      };
      createActivity(newActivity);
    } else {
      editActivity(activity);
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            validate={validate}
            initialValues={activity}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  name='title'
                  placeholder='Title'
                  value={activity.title}
                  component={TextInput}
                />
                <Field
                  name='description'
                  rows={3}
                  placeholder='Description'
                  value={activity.description}
                  component={TextAreaInput}
                />
                <Field
                  name='category'
                  placeholder='Category'
                  value={activity.category}
                  options={category}
                  component={SelectInput}
                />
                <FormGroup widths='equal'>
                  <Field
                    name='date'
                    placeholder='Time'
                    value={activity.date}
                    component={DateInput}
                    date={true}
                  />
                  <Field
                    name='time'
                    placeholder='Date'
                    value={activity.time}
                    component={DateInput}
                    time={true}
                  />
                </FormGroup>
                <Field
                  name='city'
                  placeholder='City'
                  value={activity.city}
                  component={TextInput}
                />
                <Field
                  name='venue'
                  placeholder='Venue'
                  value={activity.venue}
                  component={TextInput}
                />
                <Button
                  loading={submitting}
                  disabled={loading || invalid || pristine}
                  floated='right'
                  positive
                  type='submit'
                  content='Submit'
                ></Button>
                <Button
                  onClick={
                    activity.id
                      ? () => history.push(`/activities/${activity.id}`)
                      : () => history.push('/activities')
                  }
                  disabled={loading}
                  floated='right'
                  type='button'
                  content='Cancel'
                ></Button>
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
