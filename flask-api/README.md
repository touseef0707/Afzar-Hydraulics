```
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
venv/Scripts/activate
pip install -r requirements.txt
python -m flask --app app.py --debug

```
