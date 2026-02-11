import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import Image from 'src/components/image';
import Carousel, { useCarousel, CarouselDots, CarouselArrows } from 'src/components/carousel';
import { Link, Typography } from '@mui/material';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

type Props = {
    data: {
        id: string;
        title: string;
        coverUrl: string;
        description: string;
    }[];
};

export default function ProductCarousel({ data }: Props) {
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
            <Typography mb={2} pl={1} variant='h4'><span style={{ color: '#ff3d51' }}>The Latest.</span> All new and Lovable</Typography>
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
        <Link href={paths.product.details('234')}>
            <Box position={'relative'} mr={2}>
                <Box position={'absolute'} pl={'30px'} pt={'30px'} zIndex={10}>
                    <Typography color={'white'} variant={'h3'} pt={'24px'} fontSize={'28px!important'}>Clock 3D</Typography>
                    <Box pt={'10px'}>
                        <Typography color={'white'} variant={'body1'}>Pro Clock for Wall and Room</Typography>
                        <Typography color={'white'} variant={'caption'}>low price & high quality</Typography>
                    </Box>
                </Box>
                <Box width={400} height={500} borderRadius={'18px'} overflow={'hidden'}>
                    <Image src='/assets/images/Untitled4.jpg' height={1} width={1} />
                </Box>
            </Box>
        </Link>
    )
}
