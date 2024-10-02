import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Link, Text, VStack } from "@chakra-ui/react";

const links = {
  github: "https://github.com/Pedrojok01/CryptoCats/",
};

const Footer = () => {
  return (
    <Box display={"flex"} justifyContent={"center"} alignItems={"center"} w="100vw" h={"56px"}>
      <VStack fontSize={"0.9rem"} gap={"0.05rem"}>
        <Text>
        </Text>
        <Text></Text>
      </VStack>
    </Box>
  );
};

export default Footer;
