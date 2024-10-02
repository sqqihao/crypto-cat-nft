import { type FC, useEffect, useMemo } from "react";

import { Box, Button, Card, Flex, useColorMode } from "@chakra-ui/react";

import { RenderCat, TabHeader } from "@/components/elements";
import { useReadContract, useWriteContract, useCatFactory, useWindowWidthAndHeight } from "@/hooks";
import { useStore } from "@/store/store";

import Attributes from "./components/Attributes";

const CatFactory: FC = () => {
  const { gen0Count, maxGen0Supply } = useStore();
  const { dna, updateDna, resetCatToDefault, generateRandomCat } = useCatFactory();
  const { getGen0Count, getMaxGen0Supply } = useReadContract();
  const { mintCat, loading } = useWriteContract();
  const { colorMode } = useColorMode();
  const { isMobile, isMediumScreen } = useWindowWidthAndHeight();

  useEffect(() => {
    getGen0Count();
    getMaxGen0Supply();
  }, [getGen0Count, getMaxGen0Supply]);

  const handleMint = async () => {
    const dnaString = Object.values(dna).join("");
    await mintCat(dnaString);
    getGen0Count();
  };

  const headerDescription = useMemo(
    () => (
      <>
        在线创建NFT宠物<br />(<span>已有{gen0Count}只</span> 最多 {maxGen0Supply}!)
      </>
    ),
    [gen0Count, maxGen0Supply]
  );

  const boxWidth1 = isMobile ? 400 : isMediumScreen ? 600 : 350;
  const boxWidth2 = isMobile ? 400 : isMediumScreen ? 600 : 500;

  return (
    <>
      <TabHeader title="NFT猫工厂" description={headerDescription} />

      <Flex justify="center" m="auto" wrap={"wrap"} gap={5}>
        <Box w={boxWidth1} minW={350}>
          <RenderCat dna={dna} isFactory={true} />
          <Flex gap={2} m={"3"} justify="center">
            <Button colorScheme="blue" onClick={resetCatToDefault} className="box-shadow">
              默认DNA
            </Button>
            <Button colorScheme="yellow" onClick={generateRandomCat} className="box-shadow">
              随机DNA
            </Button>
          </Flex>
        </Box>
        <Box w={boxWidth2} minW={350}>
          <Card bgColor={colorMode === "light" ? "#ededed" : "#4f5050"} borderRadius="10" p={5} className="box-shadow">
            <Attributes dna={dna} updateDna={updateDna} />
          </Card>
          <Flex m={"3"} justify="flex-end">
            <Button
              colorScheme="green"
              onClick={handleMint}
              isLoading={loading}
              disabled={loading}
              className="box-shadow"
            >
              新建
            </Button>
          </Flex>
        </Box>
      </Flex>
    </>
  );
};

export default CatFactory;
