/**
 * Filters through the inputted data based on user input. If the search query is empty, it returns
 * the entire dataset.
 * @param data The data
 * @param searchQuery The search query
 * @returns {[]|*} Returns the export const filtered data
 */
export const filterBySearch = (data, searchQuery) => {
  if (searchQuery.length === 0) {
    return data;
  }
  const list = [];
  for (let i = 0; i < data.length; i++) {
    const suggestionName = data[i].name;
    const suggestionDescription = data[i].description;
    const nameLowercase = suggestionName.toString().toLowerCase();
    const descriptionLowercase = suggestionDescription.toString().toLowerCase();
    if (nameLowercase.includes(searchQuery.toString().toLowerCase())) {
      list.push(data[i]);
    } else if (descriptionLowercase.includes(searchQuery.toString().toLowerCase())) {
      list.push(data[i]);
    } else if (searchQuery.toString().toLowerCase() === `${nameLowercase} ${descriptionLowercase}`) {
      list.push(data[i]);
    } else if (data[i].username.includes(searchQuery.toString().toLowerCase())) {
      list.push(data[i]);
    }
  }

  return list;
};

/**
 *
 * @param data The data we want to sort
 * @param value The value we want to sort by
 * @returns {Array|*} Returns the sorted array
 */
export const sortBy = (data, value) => {
  if (value === 'names') {
    return data.sort((a, b) => a.name.localeCompare(b.name));
  }
  return data;
};

/**
 * Filters through the data based on the user selection. By default, if no option is selected it
 * returns the original data
 * @returns {[]|*} Returns the filtered array
 * @param suggestions
 * @param type
 */
export const typeResults = (suggestions, type) => {

  // if there are no skills selected
  if (type.length === 0) {
    return suggestions;
  }

  if (type === 'All') {
    return suggestions;
  }

  // Get the filtered suggestions
  const validSuggestions = [];
  for (let i = 0; i < suggestions.length; i++) {
    if (suggestions[i].type === type) {
      validSuggestions.push(suggestions[i]);
    }
  }

  return validSuggestions;
};
