// stores/hotelCatalog.js
// Centralized catalog of hotels with metadata used across the app.

export const HOTELS = [
  { name: '시그니엘 서울', star: '5성급', city: '서울', address: '서울특별시 송파구 올림픽로 300 (롯데월드타워 76-101층)', country: '대한민국' },
  { name: '시그니엘 부산', star: '5성급', city: '부산', address: '부산광역시 해운대구 달맞이길 30', country: '대한민국' },
  { name: '롯데호텔 서울', star: '5성급', city: '서울', address: '서울특별시 중구 을지로 30', country: '대한민국' },
  { name: '롯데호텔 월드', star: '5성급', city: '서울', address: '서울특별시 송파구 올림픽로 240', country: '대한민국' },
  { name: '롯데호텔 부산', star: '5성급', city: '부산', address: '부산광역시 부산진구 가야대로 772', country: '대한민국' },
  { name: '롯데호텔 제주', star: '5성급', city: '제주', address: '제주특별자치도 서귀포시 중문관광로72번길 35', country: '대한민국' },
  { name: '롯데호텔 울산', star: '5성급', city: '울산', address: '울산광역시 남구 삼산로 282', country: '대한민국' },
  { name: 'L7 명동 바이 롯데', star: '4성급', city: '서울', address: '서울특별시 중구 명동길 137', country: '대한민국' },
  { name: 'L7 강남 바이 롯데', star: '4성급', city: '서울', address: '서울특별시 강남구 테헤란로 415', country: '대한민국' },
  { name: 'L7 홍대 바이 롯데', star: '4성급', city: '서울', address: '서울특별시 마포구 양화로 141', country: '대한민국' },
  { name: 'L7 해운대 바이 롯데', star: '4성급', city: '부산', address: '부산광역시 해운대구 해운대로 620', country: '대한민국' },
  { name: 'L7 서초 바이 롯데', star: '4성급', city: '서울', address: '서울특별시 서초구 서초대로 200', country: '대한민국' },
  { name: '롯데시티호텔 마포', star: '3성급', city: '서울', address: '서울특별시 마포구 마포대로 109', country: '대한민국' },
  { name: '롯데시티호텔 김포공항', star: '3성급', city: '서울', address: '서울특별시 강서구 하늘길 38', country: '대한민국' },
  { name: '롯데시티호텔 제주', star: '4성급', city: '제주', address: '제주특별자치도 제주시 삼무로 83', country: '대한민국' },
  { name: '롯데시티호텔 대전', star: '4성급', city: '대전', address: '대전광역시 유성구 엑스포로123번길 33 (도룡동)', country: '대한민국' },
  { name: '롯데시티호텔 구로', star: '3성급', city: '서울', address: '서울특별시 구로구 디지털로 300', country: '대한민국' },
  { name: '롯데시티호텔 울산', star: '3성급', city: '울산', address: '울산광역시 남구 삼산로 204 (삼산동)', country: '대한민국' },
  { name: '롯데시티호텔 명동', star: '4성급', city: '서울', address: '서울특별시 중구 남대문로 362 (장교동)', country: '대한민국' },
  { name: '롯데리조트 속초', star: '4성급', city: '속초', address: '강원특별자치도 속초시 대포항길 186 (대포동)', country: '대한민국' },
  { name: '롯데리조트 부여', star: '4성급', city: '부여', address: '충청남도 부여군 규암면 백제문로 400', country: '대한민국' },
  { name: '롯데호텔&리조트 김해', star: '5성급', city: '김천', address: '경상남도 김해시 장유로 505', country: '대한민국' },
  { name: '롯데리조트 제주 아트빌라스', star: '5성급',city: '제주', address: '제주특별자치도 서귀포시 색달중앙로252번길 124', country: '대한민국' },
];

export function getHotelByName(name) {
  return HOTELS.find((h) => h.name === name);
}

