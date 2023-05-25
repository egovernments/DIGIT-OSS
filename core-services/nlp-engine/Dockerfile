FROM python:3.8
WORKDIR /code
COPY requirements.txt .
RUN pip install -r requirements.txt
RUN python3 -m nltk.downloader punkt
RUN python3 -m nltk.downloader averaged_perceptron_tagger

RUN git clone https://github.com/libindic/inexactsearch.git
WORKDIR inexactsearch
RUN python setup.py sdist
RUN pip install dist/libindic-inexactsearch*.tar.gz

WORKDIR /code

COPY src/ .
CMD [ "python", "./Controller.py" ] 
