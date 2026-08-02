# Practical 4 - Node.js and Express CRUD API Submission

**Student Name:** [Your Name]  
**Enrollment Number:** 24IT090  

---

## 1. Start the Server First

Before sending requests in Postman, make sure your server is running. Open your terminal in the `24IT090_pr4` directory and run:
```bash
node server.js
```
*Leave this terminal open while testing.*

---

## 2. Testing with Postman Extension (Step-by-Step)

If using the **Postman VS Code Extension**:
1. Click the **Postman Icon** on the VS Code left sidebar (if not installed, install it from the extensions marketplace by searching "Postman").
2. Create a new request tab by clicking the `+` button.
3. Test each of the following endpoints and capture screenshots of the Postman interface (make sure the request URL, body, response status, and response JSON are visible).

### Action 1: GET - Return All Tasks (Initial)
- **Method:** `GET`
- **URL:** `http://localhost:5000/tasks`
- **Steps:** Click **Send**. You should see a status of `200 OK` and an empty array `[]`.
- **Screenshot:**
  *(Replace this with your screenshot of the empty GET response, e.g., using Windows + Shift + S)*
  
  ![GET Empty Tasks](path/to/your/get_empty_screenshot.png)

---

### Action 2: POST - Create Task
- **Method:** `POST`
- **URL:** `http://localhost:5000/tasks`
- **Headers:** `Content-Type: application/json`
- **Body:** Select **Body** -> **raw** -> select **JSON** from the dropdown, and enter:
  ```json
  {
    "title": "Learn Express"
  }
  ```
- **Steps:** Click **Send**. You should see status `201 Created` and the new task object with an ID.
- **Screenshot:**
  *(Replace this with your screenshot of the POST response)*
  
  ![POST Create Task](path/to/your/post_screenshot.png)

---

### Action 3: GET - Return All Tasks (After Creation)
- **Method:** `GET`
- **URL:** `http://localhost:5000/tasks`
- **Steps:** Click **Send**. You should see status `200 OK` and the list containing the task you just created.
- **Screenshot:**
  *(Replace this with your screenshot of the GET list)*
  
  ![GET List Tasks](path/to/your/get_list_screenshot.png)

---

### Action 4: PUT - Update Task Title
- **Method:** `PUT`
- **URL:** `http://localhost:5000/tasks/1` (Assuming ID is 1)
- **Headers:** `Content-Type: application/json`
- **Body:** Select **raw** -> **JSON** and enter:
  ```json
  {
    "title": "Learn Express Fast"
  }
  ```
- **Steps:** Click **Send**. You should see status `200 OK` and the updated task object.
- **Screenshot:**
  *(Replace this with your screenshot of the PUT response)*
  
  ![PUT Update Task](path/to/your/put_screenshot.png)

---

### Action 5: DELETE - Delete Task
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/tasks/1` (Assuming ID is 1)
- **Steps:** Click **Send**. You should see status `200 OK` and the message `"Task deleted successfully"`.
- **Screenshot:**
  *(Replace this with your screenshot of the DELETE response)*
  
  ![DELETE Task](path/to/your/delete_screenshot.png)

---

## Tips for Taking Screenshots on Windows
- Press `Windows Key + Shift + S` to open the Snipping Tool.
- Select the region of your screen containing the Postman interface showing both the **Request Details** (top half) and the **Response Body/Status Code** (bottom half).
- Save each image in a folder (e.g., `24IT090_pr4/screenshots/`) and update the image paths in this file.
