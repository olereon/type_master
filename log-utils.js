// Utility functions for session logging
// This file can be used to programmatically append to the session log

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'session-log.md');

/**
 * Append a new log entry to the session log
 * @param {string} action - The action type (e.g., 'User Request', 'File Modified', 'Error')
 * @param {string} details - Detailed description of the action
 * @param {Array<string>} files - Optional array of modified files
 */
function appendToLog(action, details, files = []) {
  const timestamp = new Date().toISOString();
  
  let entry = `\n### ${action}\n`;
  entry += `**Time**: ${timestamp}\n`;
  entry += `**Details**: ${details}\n`;
  
  if (files.length > 0) {
    entry += `**Files Modified**:\n`;
    files.forEach(file => {
      entry += `- ${file}\n`;
    });
  }
  
  entry += '\n---\n';
  
  fs.appendFileSync(LOG_FILE, entry);
}

/**
 * Log a code change
 * @param {string} file - The file that was modified
 * @param {string} changeType - Type of change (create, modify, delete)
 * @param {string} description - Description of the change
 */
function logCodeChange(file, changeType, description) {
  const entry = `
### Code Change
**Time**: ${new Date().toISOString()}
**File**: ${file}
**Change Type**: ${changeType}
**Description**: ${description}

---
`;
  
  fs.appendFileSync(LOG_FILE, entry);
}

/**
 * Log an error or issue
 * @param {string} error - The error message
 * @param {string} context - Context where the error occurred
 * @param {string} resolution - How the error was resolved
 */
function logError(error, context, resolution) {
  const entry = `
### Error/Issue
**Time**: ${new Date().toISOString()}
**Error**: ${error}
**Context**: ${context}
**Resolution**: ${resolution}

---
`;
  
  fs.appendFileSync(LOG_FILE, entry);
}

/**
 * Log a user interaction
 * @param {string} request - What the user requested
 * @param {string} response - Summary of the response/action taken
 */
function logInteraction(request, response) {
  const entry = `
### User Interaction
**Time**: ${new Date().toISOString()}
**Request**: ${request}
**Response**: ${response}

---
`;
  
  fs.appendFileSync(LOG_FILE, entry);
}

module.exports = {
  appendToLog,
  logCodeChange,
  logError,
  logInteraction
};

// Example usage:
// const { logInteraction } = require('./log-utils');
// logInteraction('User asked about performance', 'Implemented 8-line windowing system');