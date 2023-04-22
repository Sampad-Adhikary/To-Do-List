FROM node:slim
WORKDIR /todolist
COPY . /todolist
RUN npm install
EXPOSE 5000
CMD node app.js