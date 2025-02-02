let hasRun = false;

chrome.action.onClicked.addListener((tab) => {
  if (!hasRun) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: splitScreen,
    });
    hasRun = true;
  } else {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: refreshPage,
    });
    hasRun = false;
  }
});

function refreshPage() {
  location.reload();
}

function splitScreen() {
  const container = Object.assign(document.createElement("div"), {
    style: "display: flex; height: 100vh; width: 100%; position: relative;",
  });

  const leftColumn = Object.assign(document.createElement("div"), {
    style: "flex: 1; overflow: auto; padding-right: 10px; position: relative;",
  });

  const rightColumn = Object.assign(document.createElement("div"), {
    style: "flex: 1; overflow: auto; position: relative;",
  });

  // Move the main content (if it exists) into the left column
  const content = document.getElementById("d_content");
  if (content) leftColumn.appendChild(content);

  const gradeCalculatorHTML = `
   <div style="background-color: #f8f9fa; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); padding: 24px; margin: 16px; font-family: 'Segoe UI', system-ui, sans-serif;">
  <h3 style="text-align: center; font-size: 22px; font-weight: 600; color: #2d3748; margin-bottom: 24px;">Desire2Calculate</h3>
  
  <!-- Mode Selection -->
  <div style="display: flex; justify-content: center; gap: 24px; margin-bottom: 24px;">
    <label style="display: flex; align-items: center; gap: 8px;">
      <input type="radio" name="mode" value="percentage" checked style="accent-color: #4CAF50;">
      <span style="color: #4a5568;">Percentage</span>
    </label>
    <label style="display: flex; align-items: center; gap: 8px;">
      <input type="radio" name="mode" value="points" style="accent-color: #4CAF50;">
      <span style="color: #4a5568;">Points</span>
    </label>
  </div>
  
  <!-- Table for Inputs -->
  <table style="width: 100%; border-collapse: separate; border-spacing: 0 12px;">
    <thead>
      <tr style="background-color: #e2e8f0; border-radius: 8px;">
        <th style="padding: 12px; text-align: left; color: #4a5568;">Assignment</th>
        <th style="padding: 12px; text-align: center; color: #4a5568;">Grade</th>
        <th style="padding: 12px; text-align: center; color: #4a5568;">Weight</th>
        <th style="width: 40px;"></th>
      </tr>
    </thead>
    <tbody id="gradeTableBody">
      <!-- Default Row -->
      <tr>
        <td style="padding: 12px; text-align: left;">
          <input type="text" class="input-field" placeholder="Assignment/Exam">
        </td>
        <td style="padding: 12px; text-align: center;">
          <input type="number" class="input-field" placeholder="Grade">
        </td>
        <td style="padding: 12px; text-align: center;">
          <input type="number" class="input-field" placeholder="Weight">
        </td>
        <td style="text-align: center;">
          <button class="remove-row-btn" style="background-color: #f44336; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">X</button>
        </td>
      </tr>
      <!-- Default Row -->
      <tr>
        <td style="padding: 12px; text-align: left;">
          <input type="text" class="input-field" placeholder="Assignment/Exam">
        </td>
        <td style="padding: 12px; text-align: center;">
          <input type="number" class="input-field" placeholder="Grade">
        </td>
        <td style="padding: 12px; text-align: center;">
          <input type="number" class="input-field" placeholder="Weight">
        </td>
        <td style="text-align: center;">
          <button class="remove-row-btn" style="background-color: #f44336; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">X</button>
        </td>
      </tr>
      <!-- Default Row -->
      <tr>
        <td style="padding: 12px; text-align: left;">
          <input type="text" class="input-field" placeholder="Assignment/Exam">
        </td>
        <td style="padding: 12px; text-align: center;">
          <input type="number" class="input-field" placeholder="Grade">
        </td>
        <td style="padding: 12px; text-align: center;">
          <input type="number" class="input-field" placeholder="Weight">
        </td>
        <td style="text-align: center;">
          <button class="remove-row-btn" style="background-color: #f44336; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">X</button>
        </td>
      </tr>
    </tbody>
  </table>
  
  <!-- Action Buttons -->
  <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 24px;">
    <!-- Add Row Button -->
    <button id="addRowButton" style="background-color: #4CAF50; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: 600;">
      + Add Row
    </button>
    
    <!-- Calculate and AI Buttons -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
      <button id="calculateButton" style="background-color: #4CAF50; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer;">
        CalcuGrade!
      </button>
      <button id="selectButton" style="background-color: #2196F3; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer;">
        ✨ AI AutoFill ✨
      </button>
    </div>
    
    <!-- Final Grade Display -->
    <div id="finalGradeDisplay" style="background-color: #ffffff; padding: 16px; border-radius: 8px; text-align: center; font-size: 18px; color: #2d3748; font-weight: 600; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
    </div>

    <!-- API Key and Syllabus Inputs -->
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <input type="text" id="apiKeyInput" class="input-field" placeholder="API Key" style="margin-top: 16px;">
      <input type="text" id="aiPrompt" class="input-field" placeholder="Syllabus Text (Optional)">
    </div>

    <!-- Save, Clear, Export, Import Buttons -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
      <button id="saveButton" style="background-color: #2196F3; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer;">
        Save
      </button>
      <button id="clearButton" style="background-color: #f44336; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer;">
        Clear
      </button>
      <button id="exportButton" style="background-color: #9C27B0; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer;">
        Export
      </button>
      <button id="importButton" style="background-color: #FF9800; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer;">
        Imporrt
      </button>
    </div>
  </div>

  <div id="loadingSpinner" style="display: none; text-align: center; padding: 20px;">
    <div class="spinner"></div>
  </div>
</div>
<style>
  .input-field {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 14px;
    color: #4a5568;
    outline: none;
    transition: border-color 0.2s;
  }

  .input-field:focus {
    border-color: #4CAF50;
  }

  .remove-row-btn {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .remove-row-btn:hover {
    background-color: #d32f2f;
  }

  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #4CAF50;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: auto;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>

  `;



  rightColumn.innerHTML = gradeCalculatorHTML;
  container.append(leftColumn, rightColumn);
  document.body.appendChild(container);

  window.addRow = function (item = {}) {
    const tableBody = document.getElementById("gradeTableBody");
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
      <td style="text-align: left; padding: 12px;">
        <input type="text" value="${item.name !== undefined && item.name !== null ? item.name : ""}" class="input-field" placeholder="Assignment/Exam">
      </td>
      <td style="text-align: center; padding: 12px;">
        <input type="number" value="${item.grade !== undefined && item.grade !== null ? item.grade : ""}" class="input-field" placeholder="Grade">
      </td>
      <td style="text-align: center; padding: 12px;">
        <input type="number" value="${item.weight !== undefined && item.weight !== null ? item.weight : ""}" class="input-field" placeholder="Weight">
      </td>
      <td style="text-align: center; padding: 12px;">
        <button class="remove-row-btn" style="background-color: #f44336; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">X</button>
      </td>
    `;

    // Add the row to the table
    tableBody.appendChild(newRow);

    // Reapply the event listener for the "remove row" button
    newRow.querySelector('.remove-row-btn').addEventListener('click', function () {
        newRow.remove();
    });
};
  document.querySelectorAll('.remove-row-btn').forEach(button => {
    button.addEventListener('click', function() {
      const row = this.closest('tr');
      row.remove();
    });
  });


  window.getValues = function () {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    const tableBody = document.getElementById("gradeTableBody");
    const rows = tableBody.getElementsByTagName("tr");
    let totalGrade = 0,
      totalWeight = 0;

    for (let row of rows) {
      const cells = row.getElementsByTagName("td");
      const grade = parseFloat(cells[1].querySelector("input").value) || 0;
      const weight = parseFloat(cells[2].querySelector("input").value) || 0;

      if (mode === "percentage" && grade >= 0 && weight > 0) {
        totalGrade += grade * (weight / 100);
        totalWeight += weight;
      } else if (mode === "points" && grade >= 0 && weight > 0) {
        totalGrade += grade;
        totalWeight += weight;
      }
    }

    let finalGradeText = "";
    if (mode === "percentage") {
      finalGradeText =
        totalWeight === 100
          ? `Final Grade: ${totalGrade.toFixed(2)}%`
          : "Error: Check Your Input Data";
    } else {
      finalGradeText =
        totalWeight > 0
          ? `Final Grade: ${((totalGrade / totalWeight) * 100).toFixed(2)}%`
          : "Error: Check Your Input Data";
    }
    document.getElementById("finalGradeDisplay").innerText = finalGradeText;
  };

  // --- Event Listeners for Buttons ---
  document.getElementById("addRowButton").addEventListener("click", window.addRow);
  document.getElementById("calculateButton").addEventListener("click", window.getValues);
  document.getElementById("selectButton").addEventListener("click", fetchSyllabus);
  document.getElementById("saveButton").addEventListener("click", saveData);
  document.getElementById("clearButton").addEventListener("click", clearData);
  document.getElementById("exportButton").addEventListener("click", exportData);
  document.getElementById("importButton").addEventListener("click", importData);

  // --- Restore ---
  restoreData();

  async function fetchSyllabus() {
    document.getElementById("loadingSpinner").style.display = "block"; // Show spinner at the start

    const apiKey = document.getElementById("apiKeyInput").value;
    const promptText = document.getElementById("aiPrompt").value;

    if (!apiKey) {
      alert("Please enter an API Key!");
      document.getElementById("loadingSpinner").style.display = "none"; // Hide if no API key
      return;
    }

    // Extract table contents (if needed)
    const tableData = extractTableData();

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-2024-08-06",
          messages: [
            {
              role: "system",
              content: `Generate based on syllabus and assignments in JSON format. Include the following fields for each assignment:
- name: The name of the assignment/exam. If there is extra credit, ensure weight is 0.
- grade: The grade as a number (e.g., 0 for zero points earned).
- weight: The weight of the assignment as a number (e.g., 80 for 80 points).

Example (this is only a template):
{
  "assignments": [
    { "name": "Initial Essay", "grade": 0, "weight": 80 },
    { "name": "Concluding Essay", "grade": 0, "weight": 80 },
    { "name": "MO1 Comprehensive Quiz", "grade": 40, "weight": 40 }
  ]
}

Ensure the JSON output matches the structure and includes all relevant assignments.`,
            },
            {
              role: "user",
              content: `Create a syllabus structure for: ${promptText}`,
            },
            {
              role: "user",
              content: `Here is the table data extracted: ${JSON.stringify(tableData)}`,
            },
          ],
          response_format: { type: "json_object" },
          max_tokens: 2000,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "API Error");

      const content = data.choices[0].message.content;
      const { assignments } = JSON.parse(content);

      // Clear existing table rows
      const tbody = document.getElementById("gradeTableBody");
      tbody.innerHTML = "";
      assignments.forEach((item) => {
        window.addRow(item);
      });

    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      document.getElementById("loadingSpinner").style.display = "none"; // al\ways hide spinner at the end
    }
}


  // --- Function to extract table data ---
  function extractTableData() {
    const table = document.getElementById("z_a");
    const extractedData = [];
    if (!table) {
      console.log("Table not found");
      return extractedData;
    }
    const clonedTable = table.cloneNode(true);
    const rows = clonedTable.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const cells = row.getElementsByTagName("td");
      if (cells.length === 0) continue;
      const gradeItem = row.querySelector("th label")?.innerText.trim() || "N/A";
      const points = cells[0].querySelector("label")?.innerText.trim() || "N/A";
      const grade = cells[1].querySelector("label")?.innerText.trim() || "N/A";
      extractedData.push({ gradeItem, points, grade });
    }
    return extractedData;
  }

  function saveData() {
    const storageKey = "gradeCalculatorData_" + window.location.href;
    const apiKey = document.getElementById("apiKeyInput").value;
    const syllabus = document.getElementById("aiPrompt").value;
    const mode = document.querySelector('input[name="mode"]:checked').value;

    const tableBody = document.getElementById("gradeTableBody");
    const rows = tableBody.getElementsByTagName("tr");
    const tableData = [];
    for (let row of rows) {
      const cells = row.getElementsByTagName("td");
      const name = cells[0].querySelector("input").value;
      const grade = cells[1].querySelector("input").value;
      const weight = cells[2].querySelector("input").value;
      tableData.push({ name, grade, weight });
    }

    const dataToSave = { apiKey, syllabus, mode, tableData };
    localStorage.setItem(storageKey, JSON.stringify(dataToSave));
    alert("Data saved for this URL!");
  }

  function restoreData() {
    const storageKey = "gradeCalculatorData_" + window.location.href;
    const saved = localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const data = JSON.parse(saved);
      document.getElementById("apiKeyInput").value = data.apiKey || "";
      document.getElementById("aiPrompt").value = data.syllabus || "";
      if (data.mode) {
        const modeRadio = document.querySelector(`input[name="mode"][value="${data.mode}"]`);
        if (modeRadio) modeRadio.checked = true;
      }
      const tableBody = document.getElementById("gradeTableBody");
      tableBody.innerHTML = "";
      if (Array.isArray(data.tableData)) {
        data.tableData.forEach((rowData) => {
          window.addRow(rowData);
        });
      }
    } catch (e) {
      console.error("Error restoring data:", e);
    }
  }

  function clearData() {
    const storageKey = "gradeCalculatorData_" + window.location.href;
    localStorage.removeItem(storageKey);
    document.getElementById("apiKeyInput").value = "";
    document.getElementById("aiPrompt").value = "";
    const tableBody = document.getElementById("gradeTableBody");
    tableBody.innerHTML = "";
    window.addRow({});
    alert("Data cleared for this URL!");
  }

  function exportData() {
    const storageKey = "gradeCalculatorData_" + window.location.href;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      // Use prompt to display the JSON string for copying.
      prompt("Exported Data (copy and save this JSON):", saved);
    } else {
      alert("No saved data found to export!");
    }
  }

  function importData() {
    const imported = prompt("Paste the exported JSON data here:");
    if (imported) {
      try {
        const data = JSON.parse(imported);
        const storageKey = "gradeCalculatorData_" + window.location.href;
        localStorage.setItem(storageKey, JSON.stringify(data));
        restoreData();
        alert("Data imported successfully!");
      } catch (e) {
        alert("Invalid data format. Please ensure you paste valid JSON.");
      }
    }
  }
}
