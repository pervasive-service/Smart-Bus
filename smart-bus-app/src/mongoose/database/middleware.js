// middleware.js
const utility = require('../../utility');
const path = require('path');

const logFilePath = 'middleware.log'
// path.join(__dirname, 'logs', 'middleware.log');
// const logFilePath = path.join(__dirname, 'logs', 'middleware.log');

async function insertEntity(EntityModel, newData) {
  try {
    const newEntity = new EntityModel(newData);
    await newEntity.save();
    console.log(`${EntityModel.modelName} created successfully`);
    utility.logToFile(`${EntityModel.modelName} created successfully`, logFilePath);
    return newEntity;
  } catch (error) {
    console.error(`Error inserting ${EntityModel.modelName}:`, error);
    utility.logToFile(`Error inserting ${EntityModel.modelName}: ${error}`, logFilePath);
    throw error;
  }
}

async function insertEntities(EntityModel, newDataArray) {
  try {
    const insertedEntities = await EntityModel.insertMany(newDataArray);
    console.log(`${EntityModel.modelName} created successfully`);
    utility.logToFile(`${EntityModel.modelName} created successfully`, logFilePath);
    return insertedEntities;
  } catch (error) {
    console.error(`Error inserting ${EntityModel.modelName}:`, error);
    utility.logToFile(`Error inserting ${EntityModel.modelName}: ${error}`, logFilePath);
    throw error;
  }
}

async function updateEntity(EntityModel, id, newData) {
  try {
    const updatedEntity = await EntityModel.findByIdAndUpdate(id, newData, { new: true });
    console.log(`${EntityModel.modelName} updated successfully`);
    utility.logToFile(`${EntityModel.modelName} updated successfully`, logFilePath);
    return updatedEntity;
  } catch (error) {
    console.error(`Error updating ${EntityModel.modelName}:`, error);
    utility.logToFile(`Error updating ${EntityModel.modelName}: ${error}`, logFilePath);
    throw error;
  }
}

async function partialUpdateEntity(EntityModel, id, newData) {
  try {
    const updatedEntity = await EntityModel.findByIdAndUpdate(id, { $set: newData }, { new: true });
    console.log(`${EntityModel.modelName} partially updated successfully`);
    utility.logToFile(`${EntityModel.modelName} partially updated successfully`, logFilePath);
    return updatedEntity;
  } catch (error) {
    console.error(`Error partially updating ${EntityModel.modelName}:`, error);
    utility.logToFile(`Error partially updating ${EntityModel.modelName}: ${error}`, logFilePath);
    throw error;
  }
}

async function deleteAllEntities(EntityModel) {
  try {
    await EntityModel.deleteMany({});
    console.log(`All ${EntityModel.modelName}s deleted successfully`);
    utility.logToFile(`All ${EntityModel.modelName}s deleted successfully`, logFilePath);
  } catch (error) {
    console.error(`Error deleting all ${EntityModel.modelName}s:`, error);
    utility.logToFile(`Error deleting all ${EntityModel.modelName}s: ${error}`, logFilePath);
    throw error;
  }
}

async function deleteEntityById(EntityModel, id) {
  try {
    const deletedEntity = await EntityModel.findByIdAndDelete(id);
    if (!deletedEntity) {
      console.log(`${EntityModel.modelName} with ID ${id} not found`);
      utility.logToFile(`${EntityModel.modelName} with ID ${id} not found`, logFilePath);
      return null;
    }
    console.log(`${EntityModel.modelName} with ID ${id} deleted successfully`);
    utility.logToFile(`${EntityModel.modelName} with ID ${id} deleted successfully`, logFilePath);
    return deletedEntity;
  } catch (error) {
    console.error(`Error deleting ${EntityModel.modelName} with ID ${id}:`, error);
    utility.logToFile(`Error deleting ${EntityModel.modelName} with ID ${id}: ${error}`, logFilePath);
    throw error;
  }
}

async function getAllEntities(EntityModel) {
  try {
    console.log(`Fetching all entities for model: ${EntityModel.modelName}`);
    const entities = await EntityModel.find({});
    return entities;
  } catch (error) {
    console.error(`Error fetching all ${EntityModel.modelName}s:`, error);
    utility.logToFile(`Error fetching all ${EntityModel.modelName}s: ${error}`, logFilePath);
    throw error;
  }
}

//  Function to search for a user by email or username
async function searchUser(EntityModel,query) {
  try {
    const user = await EntityModel.findOne(query);
    return user;  
  } catch (error) {
    console.error('Error searching for user:', error);
    utility.logToFile(`Error searching for user: ${error}`, logFilePath);
    throw error;
  }
}

module.exports = {
  insertEntity,
  insertEntities,
  updateEntity,
  partialUpdateEntity,
  deleteAllEntities,
  deleteEntityById,
  getAllEntities,
  searchUser
};
