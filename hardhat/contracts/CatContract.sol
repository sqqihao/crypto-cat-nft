// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract CatContract is ERC721Enumerable {
    uint256 MAX_SUPPLY;
    uint256 catsCount = 0;

    struct Cat{
        uint256 generation;
        uint256 indexId;
        uint256 dadId;
        uint256 mumId;
        uint64 birthTime;
        uint256 genes;
    }
    Cat[] cats;

    event Birth(
        address owner,
        uint256 indexId,
        uint256 dadId,
        uint256 mumId,
        uint256 genes
    );
    

    constructor(uint256 _max_suplly) ERC721("cryptoCat","CCT"){
        MAX_SUPPLY = _max_suplly;
    }

    function createCat(uint256 _dna) public{
        uint256 _tokenId = catsCount;
        _crateCat(0,_tokenId,0,0,_dna,msg.sender);
        catsCount+=1;
    }
    function _crateCat(
        uint256 _generation,
        uint256 _tokenId,
        uint256 _dadId,
        uint256 _mumId,
        uint256 _dna,
        address _owner) public{
            Cat memory cat = Cat({
                generation:_generation,
                indexId:_tokenId,
                dadId:_dadId,
                mumId:_mumId,
                birthTime:uint64(block.timestamp),
                genes:_dna
            });
            cats.push(cat);
            _safeMint(_owner, _tokenId);
            emit Birth(_owner,_tokenId,_dadId,_mumId,_dna);
    }
    function getCat(uint256 _id) public view returns(Cat memory){
        Cat memory cat = cats[_id];
        return cat;
    }

    function getCatByOwn() public view returns(uint256 [] memory){
        uint256 length = balanceOf(msg.sender);
        uint256 [] memory tokens = new uint256[](length);
        uint256 index = 0;
        for(uint i =0; i<catsCount;){
            if(ownerOf(i)==msg.sender){
                tokens[index]=i;
                index++;
            }
            unchecked{
                i++;
            }
        }
        return tokens;
    }

    function Breed(uint256 _dadId, uint256 _mumId) public {
        require(msg.sender == ownerOf(_dadId),"no dad");
        require(msg.sender == ownerOf(_mumId),"no mum");

        uint256 dadDna = cats[_dadId].genes;
        uint256 mumDna = cats[_mumId].genes;

        uint256 kidDna = mixDna(dadDna,mumDna);
        uint256 generation = getNeneration(cats[_dadId].generation,cats[_mumId].generation);
        uint256 newTokenId = catsCount;

        _crateCat(generation,newTokenId,0,0,kidDna,msg.sender);
        catsCount = catsCount+1;

    }

    function mixDna(uint256 _dadDna, uint256 _mumDna) public view returns(uint256){
        // randomCattribute();
        uint8 random = uint8(block.timestamp % 255); // binary between 00000000-11111111
        uint8 index = 7;
        uint16 i;
        uint256[8] memory geneArray;
        uint256 newGene;

        for (i = 1; i <= 128; i = i * 2) {
            uint256 randomMutation = randomPercent();

            // 15% mutation chances
            if (randomMutation < 85) {
                if (random & i != 0) {
                    geneArray[index] = uint8(_mumDna % 100);
                } else {
                    geneArray[index] = uint8(_dadDna % 100);
                }
            } else {
                if (index == 5 || index == 7) {
                    geneArray[index] = uint8(randomCattribute());
                } else {
                    geneArray[index] = uint8(randomXtoY(10,98));
                }
            }
            _mumDna = _mumDna / 100;
            _dadDna = _dadDna / 100;

            if (i != 128) {
                index--;
            }
        }

        for (i = 0; i < 8; i++) {
            newGene += geneArray[i];
            if (i != 7) {
                newGene *= 100;
            }
        }

        return newGene;
    }
    function getNeneration(uint256 a, uint256 b) public pure returns(uint256) {
        if(a>b){
            return a+1;
        }else{
            return b+1;
        }
    }
    function randomPercent() public view returns(uint256){
        uint256 percent = uint256(
            keccak256(
                abi.encodePacked(block.timestamp, msg.sender, gasleft())
            )
        ) % 98;
        return percent;
    }
    function randomXtoY( uint256 start ,uint256 end ) public view returns(uint256){
       uint randomNum = randomPercent();
       randomNum = randomNum%(end-start+1);
       return randomNum+start;
    }
    function randomCattribute() public view returns(uint256){
        uint256 randomAttr1 = randomXtoY(1,6);
        uint256 randomAttr2 = randomXtoY(1,5);
        return randomAttr1*10+randomAttr2;
    }

}