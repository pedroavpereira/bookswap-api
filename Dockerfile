FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

ENV PORT 3000

ENV NODE_ENV development
ENV DB_URL postgresql://postgres.qlqsmadmjmmcipubfzwo:XnfwTzAs9BJeRucn@aws-0-us-east-1.pooler.supabase.com:6543/postgres

ENV AUTH_API_URL http://127.0.0.1:5000

EXPOSE 3000

CMD ["npm","start"]