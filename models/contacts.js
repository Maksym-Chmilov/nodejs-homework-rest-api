const fs = require("fs").promises;
const path = require("path");
const shortid = require("shortid");

const contactsPath = path.join(__dirname, "contacts.json");

const updateContacts = async (allContacts) =>
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

const getContactById = async (contactId) => {
  const allContacts = await listContacts();
  const findContact = allContacts.find((item) => item.id === contactId);
  if (!findContact) return null;
  return findContact;
};

const removeContact = async (contactId) => {
  const allContacts = await listContacts();
  const index = allContacts.findIndex((item) => item.id === contactId);
  if (index === -1) return null;
  const [deleteContact] = allContacts.splice(index, 1);
  await updateContacts(allContacts);
  return deleteContact;
};

const addContact = async (body) => {
  const allContacts = await listContacts();
  const newContact = {
    id: shortid.generate(),
    ...body,
  };
  allContacts.push(newContact);
  await updateContacts(allContacts);
  return newContact;
};

const updateContact = async (contactId, body) => {
  const allContacts = await listContacts();
  const index = allContacts.findIndex((item) => item.id === contactId);
  if (index === -1) return null;
  allContacts[index] = { contactId, ...body };
  await updateContacts(allContacts);
  return allContacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
