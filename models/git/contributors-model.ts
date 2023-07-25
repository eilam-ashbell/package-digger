import PersonModel from '../npm/npm-person-model';
import UserModel from './user-model';

export default class ContributorsModel {
    contributorsCount: number;
    fetchedContributors: UserModel[];
}
