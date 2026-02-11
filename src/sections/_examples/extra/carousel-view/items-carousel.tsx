import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import Image from 'src/components/image';
import Carousel, { useCarousel, CarouselDots, CarouselArrows } from 'src/components/carousel';
import { IconButton, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
    data: {
        id: string;
        title: string;
        coverUrl: string;
        description: string;
    }[];
};

export default function ItemsCarousel({ data }: Props) {
    const theme = useTheme();

    const carousel = useCarousel({
        // slidesToShow: 4.5,
        adaptiveHeight: true,
        infinite: false,
        className: "slider variable-width",
        variableWidth: true,

        // responsive: [
        //     {
        //         breakpoint: 1024,
        //         settings: { slidesToShow: 5.5 },
        //     },
        //     {
        //         breakpoint: 600,
        //         settings: { slidesToShow: 2 },
        //     },
        //     {
        //         breakpoint: 480,
        //         settings: { slidesToShow: 1, centerPadding: '0' },
        //     },
        // ],
        // ...CarouselDots({
        //     rounded: true,
        //     sx: { mt: 3 },
        // }),
    });

    return (
        <Box>
            <Box
                sx={{
                    position: 'relative',
                    background: 'none',
                    '& .slick-list': {
                        borderRadius: 2,
                        // boxShadow: theme.customShadows.z16,
                    },
                }}
            >
                <CarouselArrows filled shape="circular" onNext={carousel.onNext} onPrev={carousel.onPrev}>
                    <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
                        {data.map((item) => (
                            <CarouselItem key={item.id} item={item} />
                        ))}
                    </Carousel>
                </CarouselArrows>
            </Box>
        </Box>
    );
}

// ----------------------------------------------------------------------

type CarouselItemProps = {
    title: string;
    description: string;
    coverUrl: string;
};

function CarouselItem({ item }: { item: CarouselItemProps }) {
    const { coverUrl, title } = item;

    return (
        <Box position={'relative'} mr={2} p={3} width={370} height={500} bgcolor={'white'} borderRadius={'28px'} overflow={'hidden'}>
            <Box position={'absolute'} zIndex={1} bottom={20} right={20}>
                <IconButton sx={{ bgcolor: 'black' }}>
                    <Iconify icon={'pepicons-pop:plus'} color={'white'} width={24} height={24} />
                </IconButton>
            </Box>
            <Box height={'50%'} width={1}>
                <Typography color={'black'} variant={'h3'} pt={'24px'} fontSize={'28px!important'}>Special Clock Hand</Typography>
                <Box pt={'10px'}>
                    <Typography color={'black'} variant={'body1'}>Pro. Beyond.</Typography>
                    <Typography color={'black'} variant={'caption'}>From $41.62/mo. for 24 mo. or $999 before trade‑in</Typography>
                </Box>
            </Box>
            <Box height={'50%'} width={1}>
                <Image src='/assets/images/hand.jpg' width={1} height={1} />
            </Box>

        </Box>
    )
}
