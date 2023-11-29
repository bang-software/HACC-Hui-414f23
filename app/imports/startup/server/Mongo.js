import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { SyncedCron } from 'meteor/littledata:synced-cron';
import { HACCHui } from '../../api/hacc-hui/HACCHui';
import { CanCreateTeams } from '../../api/team/CanCreateTeamCollection';
import { CanChangeChallenges } from '../../api/team/CanChangeChallengeCollection';

// global Assets

function documentCounts() {
  return HACCHui.collectionLoadSequence.map((collection) => collection.count());
}

function totalDocuments() {
  return documentCounts().reduce((sum, count) => sum + count, 0);
}

/**
 * The load/fixture file date format.
 * Used when dumping and restoring the HACC-Hui database.
 * @type {string}
 * @memberOf startup/server
 */
const loadFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

/**
 * Returns a string indicating how long ago the load file was created. Parses the file name string.
 * @param loadFileName The file name.
 * @returns { String } A string indicating how long ago the file was created.
 * @memberOf startup/server
 */
function getRestoreFileAge(loadFileName) {
  const terms = loadFileName.match(/[^/. ]+/g) || [];
  const dateString = terms[terms.length - 2];
  return moment(dateString, loadFileDateFormat).fromNow();
}

/**
 * Returns the definition array associated with collectionName in the loadJSON structure,
 * or an empty array if none was found.
 * @param loadJSON The load file contents.
 * @param collection The collection of interest.
 * @memberOf startup/server
 */
export function getDefinitions(loadJSON, collection) {
  const definitionObj = loadJSON.collections.find((obj) => obj.name === collection);
  return definitionObj ? definitionObj.contents : [];
}

/**
 * Given a collection and the loadJSON structure, looks up the definitions and invokes define() on them.
 * @param collection The collection to be loadd.
 * @param loadJSON The structure containing all of the definitions.
 * @param consolep output console.log message if truey.
 * @memberOf startup/server
 */
export function loadCollection(collection, loadJSON, consolep) {
  const definitions = getDefinitions(loadJSON, collection._collectionName);
  if (consolep) {
    console.log(`Defining ${definitions.length} ${collection._collectionName} documents.`);
  }
  definitions.forEach((definition) => collection.define(definition));
  if (consolep) {
    console.log(`Have ${collection.find().count()} documents.`);
  }
}

/**
 * If the database is empty, this function looks up the name of the load file in the settings file,
 * and if it is specified, then it reads it in and calls define() on its contents in order to load the database.
 * Console messages are generated when the contents of the load file does not include collections that
 * this function assumes are present. Conversely, if the load file contains collections not processed with
 * this file, a string is also printed out.
 * @memberOf startup/server
 */
function loadDatabase() {
  const canCreateTeams = CanCreateTeams.findOne();
  if (canCreateTeams === undefined) {
    CanCreateTeams.define({ canCreateTeams: true });
  }
  const canChangeChallenges = CanChangeChallenges.findOne();
  if (canChangeChallenges === undefined) {
    CanChangeChallenges.define({ canChangeChallenges: true });
  }
  const loadFileName = Meteor.settings.databaseRestoreFileName;
  if (loadFileName && totalDocuments() === 0) {
    const loadFileAge = getRestoreFileAge(loadFileName);
    console.log(`Loading database from file ${loadFileName}, dumped ${loadFileAge}.`);
    const loadJSON = JSON.parse(Assets.getText(loadFileName));
    // The list of collections, ordered so that they can be sequentially restored.
    const collectionList = HACCHui.collectionLoadSequence;
    const loadNames = loadJSON.collections.map((obj) => obj.name);
    const collectionNames = collectionList.map((collection) => collection.getCollectionName());
    const extraRestoreNames = loadNames.filter(name => !collectionNames.includes(name));
    const extraCollectionNames = collectionNames.filter(name => !loadNames.includes(name));
    if (extraRestoreNames.length) {
      console.log(`Error: Expected collections are missing from collection list: ${extraRestoreNames}`);
    }
    if (extraCollectionNames.length) {
      console.log(`Error: Expected collections are missing from restore JSON file: ${extraCollectionNames}`);
    }
    if (!extraRestoreNames.length && !extraCollectionNames.length) {
      collectionList.forEach((collection) => loadCollection(collection, loadJSON, true));
    }
    console.log('Finished loading database.');
  }
}

Meteor.startup(() => {
  loadDatabase();
  SyncedCron.start();
});
