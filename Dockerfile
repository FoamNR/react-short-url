from node:22.15-alpine
WORKDIR /app

COPY . ./

RUN npm i

EXPOSE 5000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]