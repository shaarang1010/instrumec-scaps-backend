## Backend repository for Instrumec Scaps

### SAMLight instructions [link](http://download.scaps.com/downloads/Software/Programming/Client_Control_Interface/Manual/html/index.html?job.htm)

1. Import File -
   ```
   function: ScCciImport(string Entity_Name, string File_Name, string File_Type, double Resolution, int Flag)
   description: Imports a file from the path FileName
   eg: cci.ScImport("BackgroundImage", "C:\\TestBitmap.bmp", "bmp", 1, (int)ScComSAMLightClientCtrlFlags.scComSAMLightClientCtrlImportFlagBitmapReimport);
   params:
   ```
2. Get Current Job Path -

   ```
   function: ScCciImport(string Entity_Name, string File_Name, string File_Type, double Resolution, int Flag)
   description: Imports a file from the path FileName
   eg: string JobFileName = "C:/Users/Support/Desktop/CircleJob.sjf";
       string BmpFileName = "C:/Users/Support/Desktop/PreviewCircleJob.bmp";
       int CCI_Return = cci.ScGetPreviewImage(JobFileName, BmpFileName);
   ```

3. Load Job -
   ```
   function:  ScCciLoadJob(string File_Name, int Load_Entitie, int Overwrite_Entity, int Load_Material)
   description: Loads the SJF or S3D job file specified by FileName into the controlled scanner application. A SJF job file can contain graphical data (entities) and / or scanner and laser parameters (materials).
   eg: int CCI_Return = cci.ScLoadJob(FileName, 1, 1, 1);
   params:
   **Load_entity** = If the parameter Load_Entity is set to 1, the entities contained in the job will be loaded.
   **Overwrite_entity** = If the parameter Overwrite_Entity is set to 1, the current job will be cleared before the new one is loaded. If Overwrite_Entities is set to 0, it is possible to merge the graphical information of different jobs.
   **Load_material**= If the parameter Load_Material is set to 1, the scanner parameters will be loaded with the job.
   ```
4. IsMarking

   ```
   function:  ScCciIsMarking()
   description: If the ScMarkEntityByName function was called with WaitForMarkEnd set to 0, this function can be used for checking whether the actual marking process is already finished or not. The Function returns 1 if the scanner application is still marking.
   eg: int CCI_Return = cci.ScIsMarking();
   ```

5. Mark Entity by Name
   ```
   function: ScCciMarkEntityByName(string Entity_Name, int Wait_For_Mark_End)
   description: Marks the entity with the name Entity_Name.
   eg: int CCI_Return = cci.ScMarkEntityByName( "", 1 );
   params:
   **Entity Name**
   **Wait_For_Mark_End**=If it is set to 0, the function returns immediately and the client application can start other tasks while the scanner application is marking in background. If it is set to 1, function returns at the end of marking.
   ```
6. Serial Number file
   ```
   function: ScCciSetEntityStringData(string Entity_Name, int Data_ID, string Name)
   description: This is used to change the file name of a serial number list in txt/xlsx format. This is recommended to use with ResetSerialNumber together.
   eg: int CCI_Return = cci.ScSetEntityStringData("SerialEntity1", (int)ScComSAMLightClientCtrlFlags.scComSAMLightClientCtrlStringDataIdEntitySerialASCIIFileName, newName);
   params:
   **Entity Name**
   **Wait_For_Mark_End**=If it is set to 0, the function returns immediately and the client application can start other tasks while the scanner application is marking in background. If it is set to 1, function returns at the end of marking.
   ```

### SERIAL COMM

#### CONFIG

> BAUD RATE : 15200
> DATA BITS: 8
> STOP BITS: 1

### ACCESS COMMANDS

Access Commands in `setup/serialcommands.json`

### Note:

- Add <LF> at the end of command to SAMLight. SAMLight returns <LF>
- Use "" for quotations.
- Sending \n as text in a non path string parameter
