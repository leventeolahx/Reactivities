import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../modules/activity';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';

configure({ enforceActions: 'always' });

class ActivityStore {
    @observable activityRegistry = new Map();
    @observable activity: IActivity | null = null;
    @observable loadingInitial = false;
    @observable submitting = false;
    @observable target = '';

    @computed get activitiesByData() {
        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
    }

    groupActivitiesByDate(activities: IActivity[]) {
        const sortedActivities = activities.sort(
            (a, b) => a.date.getTime() - b.date.getTime()
        );
        return Object.entries(sortedActivities.reduce((activities, activity) => {
            const date = activity.date.toISOString().split('T')[0];
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];
            return activities;
        }, {} as { [key: string]: IActivity[] }));
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            runInAction('loading activities', () => {
                activities.forEach((activity) => {
                    activity.date = new Date(activity.date);
                    this.activityRegistry.set(activity.id, activity);
                });
            });
        } catch (error) {
            console.log(error)
        } finally {
            runInAction('loading activities finally', () => {
                this.loadingInitial = false;
            });
        }
    }

    @action loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.activity = activity;
            return activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.detials(id);
                runInAction('getting activity', () => {
                    activity.date = new Date(activity.date);                      
                    this.activity = activity;
                    this.activityRegistry.set(activity.id, activity);
                    this.loadingInitial = false;
                })                
                return activity;
            } catch (error) {
                console.log(error);
            } finally {
                runInAction('getting activity', () => {
                    this.loadingInitial = false;
                })
            }
        }
    }

    @action clearActivity = () => {
        this.activity = null;
    }

    getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction('creating activity', () => {
                this.activityRegistry.set(activity.id, activity);
                this.submitting = false;
            });
            history.push(`/activities/${activity.id}`);
        } catch (error) {
            console.log(error.response);
            toast.error('Problem submitting data');
        } finally {
            runInAction('creating activity finally', () => {
                this.submitting = false;
            });
        }
    }

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction('editing activity', () => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
                this.submitting = false;
            });
            history.push(`/activities/${activity.id}`);
        } catch (error) {
            console.log(error.response);
            toast.error('Problem submitting data');
        } finally {
            runInAction('editing activity finally', () => {
                this.submitting = false;
            });
        }
    }

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name
        try {
            await agent.Activities.delete(id);
            runInAction('deleting activity', () => {
                this.activityRegistry.delete(id);
                this.activity = null;
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction('deleting activity finally', () => {
                this.submitting = false;
                this.target = '';
            });
        }
    }
}

export default createContext(new ActivityStore());