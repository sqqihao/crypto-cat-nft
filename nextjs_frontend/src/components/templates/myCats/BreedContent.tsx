import { type FC, useState } from "react";

import { Button, Center, HStack, VStack, Wrap } from "@chakra-ui/react";
import { useAccount } from "wagmi";

import { Loading, TabHeader } from "@/components/elements";
import { useReadContract, useWriteContract } from "@/hooks";
import { useStore } from "@/store/store";

import CatSelection from "./components/CatSelection";
import NoCatFound from "./components/NoCatFound";

const BreedContent: FC = () => {
  const { address } = useAccount();
  const { userCats } = useStore();
  const { getUserCats } = useReadContract();
  const { breedCat, loading } = useWriteContract();
  const [mum, setMum] = useState<SelectedCat>();
  const [dad, setDad] = useState<SelectedCat>();

  const isBreedEnable = !!(mum && dad);

  const handleReset = async () => {
    setMum(undefined);
    setDad(undefined);
  };

  const handleBreed = async () => {
    if (mum && dad && address) {
      debugger;
      await breedCat(mum.id, dad.id);
      setMum(undefined);
      setDad(undefined);
      getUserCats(address);
    }
  };

  return (
    <>
      <TabHeader title="NFT猫咪哺育" description="选择两只猫." />

      {!userCats && <Loading />}

      {userCats?.length === 0 && <NoCatFound />}

      {userCats && userCats.length > 0 && (
        <Center>
          <VStack>
            <Wrap w={"100%"} m="auto" gap={20} justify="center">
              <CatSelection cat={mum} setCat={setMum} name="母亲" otherParent={dad} loading={loading} />
              <CatSelection cat={dad} setCat={setDad} name="父亲" otherParent={mum} loading={loading} />
            </Wrap>

            <HStack gap={20}>
              <Button colorScheme="red" isLoading={loading} onClick={handleReset} className="box-shadow">
                重置
              </Button>
              <Button
                colorScheme="green"
                isLoading={loading}
                disabled={!isBreedEnable || loading}
                onClick={handleBreed}
                className="box-shadow"
              >
                哺育
              </Button>
            </HStack>
          </VStack>
        </Center>
      )}
    </>
  );
};

export default BreedContent;
