FROM quay.io/loki-xer/jarvis-md:latest
RUN git clone https://github.com/Kingbadan321/Zeta-XD /root/zeta/
WORKDIR /root/zeta/
RUN yarn install --network-concurrency 1
CMD ["npm", "start"]
