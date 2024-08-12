import Link from "next/link";
import styles from "./home.module.css";
import Image from "next/image";
import { MainNav } from "@/components/main-nav";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SiteFooter } from "@/components/site-footer";
const menuitems = [
  {
    title: "Features",
    href: "/#features",
  },
  {
    title: "Pricing",
    href: "/pricing",
  },
  {
    title: "Blog",
    href: "/blog",
  },
  // {
  //   title: "Documentation",
  //   href: "/docs",
  // },
];

export default function Home() {
  return (
    <div className={` flex min-h-screen flex-col`}>
      <header className="container z-40 bg-background sticky top-0">
        <div className="flex h-20 items-center justify-between py-6">
          <MainNav items={menuitems} />
          <nav>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "secondary", size: "default" })
              )}
            >
              Login
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <>
          <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
            <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
              <Link
                href={"https://x.com/mygodlon"}
                className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
              >
                Follow along on Twitter
              </Link>
              <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                Assignments Just Got Easier - Try Quix Now!
              </h1>
              <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                Quix.ai is an AI assistant for teachers that helps in creating,
                evaluating, and grading student assignments and managing
                students.
              </p>
              <div className="lg:space-x-4 flex gap-3 sm:flex-row">
                <div>
                  <Link
                    href="/login"
                    className={cn(buttonVariants({ size: "lg" }))}
                  >
                    Get Started
                  </Link>
                </div>
                <div
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" })
                  )}
                >
                  Learn more
                </div>
              </div>
            </div>
          </section>
          <section
            id="features"
            className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24 rounded-xl"
          >
            <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
              <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                Features
              </h2>
              <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                Designed for educators and students, our platform evolves with
                your needs. We&apos;re here to make teaching and learning
                effortless.
              </p>
            </div>
            <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
              <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                <div className="flex gap-2 flex-col justify-between rounded-md p-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fillRule="evenodd"
                    strokeLinejoin="round"
                    width="64"
                    height="64"
                    strokeMiterlimit="2"
                    clipRule="evenodd"
                    fill="currentColor"
                    viewBox="0 0 512 512"
                    id="learning"
                  >
                    <path
                      d="M652.72,2714.39L643.455,2714.39C640.693,2714.39 638.455,2716.62 638.455,2719.39L638.455,2744C638.455,2746.76 640.693,2749 643.455,2749L992.545,2749C995.307,2749 997.545,2746.76 997.545,2744L997.545,2719.39C997.545,2716.62 995.307,2714.39 992.545,2714.39L983.28,2714.39L983.28,2665.18C983.28,2641.08 963.715,2621.52 939.616,2621.52C939.616,2621.52 892.747,2621.52 892.747,2621.52C868.649,2621.52 849.084,2641.08 849.084,2665.18L849.084,2714.39L786.916,2714.39L786.916,2665.18C786.916,2641.08 767.351,2621.52 743.253,2621.52C743.253,2621.52 696.384,2621.52 696.384,2621.52C672.285,2621.52 652.72,2641.08 652.72,2665.18L652.72,2714.39ZM987.545,2724.39L987.545,2739C987.545,2739 648.455,2739 648.455,2739C648.455,2739 648.455,2724.39 648.455,2724.39C690.78,2724.39 987.545,2724.39 987.545,2724.39L987.545,2724.39ZM973.28,2714.39L973.28,2665.18C973.28,2646.6 958.196,2631.52 939.616,2631.52L892.747,2631.52C874.168,2631.52 859.084,2646.6 859.084,2665.18L859.084,2714.39L874.818,2714.39L874.818,2672.95C874.818,2670.19 877.059,2667.95 879.818,2667.95C882.578,2667.95 884.818,2670.19 884.818,2672.95L884.818,2714.39L947.545,2714.39L947.545,2672.95C947.545,2670.19 949.786,2667.95 952.545,2667.95C955.305,2667.95 957.545,2670.19 957.545,2672.95L957.545,2714.39L973.28,2714.39ZM776.916,2714.39L776.916,2665.18C776.916,2646.6 761.832,2631.52 743.253,2631.52L696.384,2631.52C677.804,2631.52 662.72,2646.6 662.72,2665.18L662.72,2714.39L678.455,2714.39L678.455,2672.95C678.455,2670.19 680.695,2667.95 683.455,2667.95C686.214,2667.95 688.455,2670.19 688.455,2672.95L688.455,2714.39L751.182,2714.39L751.182,2672.95C751.182,2670.19 753.422,2667.95 756.182,2667.95C758.941,2667.95 761.182,2670.19 761.182,2672.95L761.182,2714.39L776.916,2714.39ZM720.378,2524.18C694.152,2524.18 672.86,2545.47 672.86,2571.69C672.86,2597.92 694.152,2619.21 720.378,2619.21C746.603,2619.21 767.895,2597.92 767.895,2571.69C767.895,2545.47 746.603,2524.18 720.378,2524.18ZM916.741,2524.18C890.516,2524.18 869.224,2545.47 869.224,2571.69C869.224,2597.92 890.516,2619.21 916.741,2619.21C942.967,2619.21 964.259,2597.92 964.259,2571.69C964.259,2545.47 942.967,2524.18 916.741,2524.18ZM720.378,2534.18C741.084,2534.18 757.895,2550.99 757.895,2571.69C757.895,2592.4 741.084,2609.21 720.378,2609.21C699.671,2609.21 682.86,2592.4 682.86,2571.69C682.86,2550.99 699.671,2534.18 720.378,2534.18ZM916.741,2534.18C937.448,2534.18 954.259,2550.99 954.259,2571.69C954.259,2592.4 937.448,2609.21 916.741,2609.21C896.035,2609.21 879.224,2592.4 879.224,2571.69C879.224,2550.99 896.035,2534.18 916.741,2534.18ZM818,2294.28C806.162,2270.79 778.109,2258.8 748.915,2259C746.168,2259.02 743.951,2261.26 743.951,2264L743.951,2284.28C738.802,2283.95 733.593,2283.8 728.321,2283.84C725.574,2283.86 723.357,2286.09 723.357,2288.84L723.357,2357.46L670.028,2357.46C647.662,2357.46 629.503,2375.62 629.503,2397.99L629.503,2469.03C629.503,2491.4 647.662,2509.56 670.028,2509.56C670.028,2509.56 790.134,2509.56 790.134,2509.56C790.134,2509.56 813.556,2554.96 813.556,2554.96C814.414,2556.63 816.129,2557.67 818,2557.67C819.871,2557.67 821.586,2556.63 822.444,2554.96L845.866,2509.56C845.866,2509.56 965.972,2509.56 965.972,2509.56C988.338,2509.56 1006.5,2491.4 1006.5,2469.03L1006.5,2397.99C1006.5,2375.62 988.338,2357.46 965.972,2357.46L912.643,2357.46L912.643,2288.84C912.643,2286.09 910.426,2283.86 907.679,2283.84C902.407,2283.8 897.198,2283.95 892.049,2284.28L892.049,2264C892.049,2261.26 889.832,2259.02 887.085,2259C857.891,2258.8 829.838,2270.79 818,2294.28ZM912.643,2367.46L912.643,2450.83C912.643,2452.16 912.112,2453.44 911.166,2454.38C910.221,2455.32 908.94,2455.84 907.608,2455.83C876.159,2455.61 847.009,2462.27 820.338,2476.38C818.875,2477.16 817.125,2477.16 815.662,2476.38C788.991,2462.27 759.841,2455.61 728.392,2455.83C727.06,2455.84 725.779,2455.32 724.834,2454.38C723.888,2453.44 723.357,2452.16 723.357,2450.83L723.357,2367.46L670.028,2367.46C653.181,2367.46 639.503,2381.14 639.503,2397.99C639.503,2397.99 639.503,2469.03 639.503,2469.03C639.503,2485.88 653.181,2499.56 670.028,2499.56L793.18,2499.56C795.052,2499.56 796.766,2500.6 797.624,2502.27C797.624,2502.27 818,2541.76 818,2541.76L838.376,2502.27C839.234,2500.6 840.948,2499.56 842.82,2499.56L965.972,2499.56C982.819,2499.56 996.497,2485.88 996.497,2469.03C996.497,2469.03 996.497,2397.99 996.497,2397.99C996.497,2381.14 982.819,2367.46 965.972,2367.46L912.643,2367.46ZM902.643,2438.89C873.117,2439.37 845.656,2446.05 820.414,2459.38C820.326,2459.43 820.237,2459.48 820.146,2459.52C819.848,2459.66 819.532,2459.78 819.205,2459.86C818.975,2459.91 818.743,2459.95 818.511,2459.98L818.494,2459.98C818.367,2459.99 818.24,2460 818.114,2460L818.071,2460L818.041,2460.01L817.99,2460.01L817.943,2460.01L817.898,2460L817.886,2460C817.76,2460 817.633,2459.99 817.506,2459.98L817.489,2459.98C817.257,2459.95 817.025,2459.91 816.795,2459.86C816.467,2459.78 816.152,2459.66 815.854,2459.52C815.763,2459.48 815.674,2459.43 815.586,2459.38C790.348,2446.05 762.887,2439.37 733.357,2438.89L733.357,2445.85C763.69,2446.32 791.949,2453.01 818,2466.33C844.051,2453.01 872.31,2446.32 902.643,2445.85L902.643,2438.89ZM827.983,2444.64C851.226,2434.46 876.143,2429.3 902.643,2428.89C902.643,2428.89 902.643,2293.86 902.643,2293.86C899.082,2293.92 895.55,2294.06 892.049,2294.3L892.049,2409.03C892.049,2410.37 891.518,2411.64 890.572,2412.58C889.627,2413.52 888.346,2414.04 887.014,2414.03C867.464,2413.9 841.198,2421.99 827.983,2444.64ZM743.951,2294.3C740.45,2294.06 736.918,2293.92 733.357,2293.86C733.357,2293.86 733.357,2428.89 733.357,2428.89C759.857,2429.3 784.774,2434.46 808.017,2444.64C794.802,2421.99 768.536,2413.9 748.986,2414.03C747.654,2414.04 746.373,2413.52 745.428,2412.58C744.482,2411.64 743.951,2410.37 743.951,2409.03L743.951,2294.3ZM753.951,2289.63C753.951,2289.66 753.951,2289.7 753.951,2289.73L753.951,2404.16C773.966,2405.27 798.243,2413.85 813,2434.01L813,2310.43C807.922,2283.83 781.814,2270.34 753.951,2269.1L753.951,2289.63ZM882.049,2289.63L882.049,2269.1C854.186,2270.34 828.078,2283.83 823,2310.43L823,2434.01C837.757,2413.85 862.034,2405.27 882.049,2404.16L882.049,2289.73C882.049,2289.7 882.049,2289.66 882.049,2289.63Z"
                      transform="translate(-562 -2248)"
                    ></path>
                  </svg>
                  <div className="space-y-2">
                    <h3 className="font-bold">Management</h3>
                    <p className="text-sm text-muted-foreground">
                      Effortless Student Management Made Simple with classrooms
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                <div className="flex gap-2 flex-col justify-between rounded-md p-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                    id="paper"
                  >
                    <path d="M4.498 1.5c-.011 0-.02.006-.031.006A2.503 2.503 0 0 0 2 4.004a.5.5 0 0 0 .5.5h3.498V28c0 1.379 1.122 2.5 2.5 2.5H27.5a2.496 2.496 0 0 0 2.467-2.16.485.485 0 0 0 .033-.17v-2.166a.5.5 0 0 0-.5-.5h-2.502V5c0-1.93-1.57-3.5-3.5-3.5h-19zm1.986 1h17.014c1.378 0 2.5 1.121 2.5 2.5v20.504H10.5a.5.5 0 0 0-.5.5V28c0 .827-.673 1.5-1.5 1.5S7 28.827 7 28l-.002-.012V4.016L7 4.004c0-.566-.197-1.084-.516-1.504zM4.5 2.504c.652 0 1.207.418 1.414 1H3.086c.207-.582.762-1 1.414-1zm6.5 24h18V28c0 .827-.673 1.5-1.5 1.5H10.486c.318-.419.514-.935.514-1.5v-1.496z"></path>
                  </svg>
                  <div className="space-y-2">
                    <h3 className="font-bold">Assignment Creation</h3>
                    <p className="text-sm text-muted-foreground">
                      Seamless Assignment Creation with Just Topics, PDFs, Text,
                      and More.
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                <div className="flex gap-2 flex-col justify-between rounded-md p-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 16 16"
                    id="signed"
                    fill="currentColor"
                  >
                    <path d="M11.3350225,2.06528672 L11.4114434,2.21785146 L11.9878973,3.75083256 C12.0331883,3.87155495 12.128445,3.96681168 12.2491674,4.0121027 L13.7292409,4.567377 C14.3787439,4.81104892 14.7277671,5.50508597 14.5546931,6.16174105 L14.5130513,6.29242912 L13.8244843,7.81525412 C13.7711463,7.93264332 13.7711463,8.06735668 13.8244843,8.18474588 L14.4784161,9.62395408 C14.765382,10.2555242 14.5214203,10.9930791 13.9347133,11.3350225 L13.7821485,11.4114434 L12.2491674,11.9878973 C12.128445,12.0331883 12.0331883,12.128445 11.9878973,12.2491674 L11.432623,13.7292409 C11.1889511,14.3787439 10.494914,14.7277671 9.83825895,14.5546931 L9.70757088,14.5130513 L8.18474588,13.8244843 C8.06735668,13.7711463 7.93264332,13.7711463 7.81525412,13.8244843 L6.37604592,14.4784161 C5.74447583,14.765382 5.00692091,14.5214203 4.66497746,13.9347133 L4.58855657,13.7821485 L4.0121027,12.2491674 C3.96681168,12.128445 3.87155495,12.0331883 3.75083256,11.9878973 L2.27075911,11.432623 C1.62125605,11.1889511 1.27223293,10.494914 1.44530694,9.83825895 L1.4869487,9.70757088 L2.17551567,8.18474588 C2.2288537,8.06735668 2.2288537,7.93264332 2.17551567,7.81525412 L1.52158391,6.37604592 C1.23461797,5.74447583 1.47857965,5.00692091 2.06528672,4.66497746 L2.21785146,4.58855657 L3.75083256,4.0121027 C3.87155495,3.96681168 3.96681168,3.87155495 4.0121027,3.75083256 L4.567377,2.27075911 C4.81104892,1.62125605 5.50508597,1.27223293 6.16174105,1.44530694 L6.29242912,1.4869487 L7.81525412,2.17551567 C7.93264332,2.2288537 8.06735668,2.2288537 8.18474588,2.17551567 L9.62395408,1.52158391 C10.2555242,1.23461797 10.9930791,1.47857965 11.3350225,2.06528672 Z M5.40366451,2.58450635 L4.84839021,4.0645798 C4.71251714,4.42674697 4.42674697,4.71251714 4.0645798,4.84839021 L2.58450635,5.40366451 L2.48652396,5.45496873 C2.31248911,5.57557989 2.24408587,5.80694681 2.33478128,6.00655415 L2.98871304,7.44576235 C3.14872713,7.79792997 3.14872713,8.20207003 2.98871304,8.55423765 L2.32877333,10.0072845 L2.30177484,10.0990074 C2.26399858,10.3073536 2.37923131,10.5193231 2.58450635,10.5963355 L4.0645798,11.1516098 C4.42674697,11.2874829 4.71251714,11.573253 4.84839021,11.9354202 L5.40366451,13.4154937 L5.45496873,13.513476 C5.57557989,13.6875109 5.80694681,13.7559141 6.00655415,13.6652187 L7.44576235,13.011287 C7.79792997,12.8512729 8.20207003,12.8512729 8.55423765,13.011287 L10.0072845,13.6712267 L10.0990074,13.6982252 C10.3073536,13.7360014 10.5193231,13.6207687 10.5963355,13.4154937 L11.1516098,11.9354202 C11.2874829,11.573253 11.573253,11.2874829 11.9354202,11.1516098 L13.4154937,10.5963355 L13.513476,10.5450313 C13.6875109,10.4244201 13.7559141,10.1930532 13.6652187,9.99344585 L13.011287,8.55423765 C12.8512729,8.20207003 12.8512729,7.79792997 13.011287,7.44576235 L13.6712267,5.99271553 L13.6982252,5.90099257 C13.7360014,5.69264638 13.6207687,5.48067687 13.4154937,5.40366451 L11.9354202,4.84839021 C11.573253,4.71251714 11.2874829,4.42674697 11.1516098,4.0645798 L10.5963355,2.58450635 L10.5450313,2.48652396 C10.4244201,2.31248911 10.1930532,2.24408587 9.99344585,2.33478128 L8.55423765,2.98871304 C8.20207003,3.14872713 7.79792997,3.14872713 7.44576235,2.98871304 L6.00655415,2.33478128 L5.97868188,2.32323621 C5.74774746,2.2365973 5.49030342,2.35357193 5.40366451,2.58450635 Z M6.97824598,9.34665508 L10.1638976,5.70591039 C10.3263188,5.52028615 10.6084654,5.50147638 10.7940896,5.66389759 C10.9565108,5.80601614 10.9912147,6.03979944 10.8885433,6.2203784 L10.8361024,6.29408961 L7.33610241,10.2940896 C7.18724716,10.4642099 6.93964087,10.4930998 6.75768628,10.3752853 L6.68420455,10.3157955 L5.18420455,8.81579545 C5.00979554,8.64138644 5.00979554,8.35861356 5.18420455,8.18420455 C5.33681243,8.03159666 5.5723864,8.01252068 5.74573581,8.12697659 L5.81579545,8.18420455 L6.97824598,9.34665508 L10.1638976,5.70591039 L6.97824598,9.34665508 Z"></path>
                  </svg>
                  <div className="space-y-2">
                    <h3 className="font-bold">Assignment Correction</h3>
                    <p className="text-sm text-muted-foreground">
                      Simplify the assignment correction process through our
                      automatic assignemt correction
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                <div className="flex gap-2 flex-col justify-between rounded-md p-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    id="report"
                    width="64"
                    height="64"
                    fill="currentColor"
                  >
                    <path d="m16.09 12.33 8.74 2.147a.499.499 0 0 0 .239-.97l-8.74-2.147a.502.502 0 0 0-.604.366.497.497 0 0 0 .365.604zm10.204 4.567L13.67 13.796a.499.499 0 1 0-.238.97l12.625 3.102a.499.499 0 0 0 .237-.971zm-.715 2.914-12.625-3.102a.499.499 0 1 0-.238.97l12.625 3.102a.499.499 0 0 0 .238-.97zm-.716 2.913-8.209-2.017a.499.499 0 1 0-.238.97l8.209 2.017a.499.499 0 0 0 .238-.97zm-.716 2.913-2.375-.583a.5.5 0 0 0-.238.97l2.375.583a.499.499 0 0 0 .238-.97zM17.776 9.655l5.827 1.432a.499.499 0 0 0 .239-.97L18.5 8.804l.239-.972 5.341 1.313a.499.499 0 1 0 .238-.97l-5.827-1.432a.5.5 0 0 0-.604.366l-.477 1.942a.496.496 0 0 0 .366.604z"></path>
                    <path d="M15.637 28.806c.226-.017.438-.087.63-.197l1.205 1.04a1.494 1.494 0 0 0 1.09.359c.4-.029.764-.213 1.025-.516l.611-.708 4.937 1.213a.499.499 0 0 0 .605-.366l4.295-17.479c.005-.022.001-.044.003-.066a.493.493 0 0 0-.06-.312l-2.93-4.839a.489.489 0 0 0-.25-.199c-.02-.008-.037-.022-.058-.027l-2.99-.734-3.841-3.841a.5.5 0 0 0-.286-.133c-.023-.003-.044-.013-.068-.013h-13a.5.5 0 0 0-.5.5V13.78l-3.481-.883a.5.5 0 0 0-.584.677l1.721 4.128.008.01a.492.492 0 0 0 .127.176l2.21 1.907v4.692a.5.5 0 0 0 .5.5h1.791l-.087.351a.499.499 0 0 0 .366.604l5.411 1.33c-.002.049-.01.098-.007.148.029.399.212.764.516 1.025a1.49 1.49 0 0 0 1.091.361zm2.851.206a.482.482 0 0 1-.363-.12l-1.135-.98 1.96-2.27 1.135.98a.496.496 0 0 1 .052.704l-.496.574-.811.94a.502.502 0 0 1-.342.172zM6.837 15.186l3.463 2.99 6.377 5.504-.653.757-9.841-8.494.654-.757zm6.177-9.199h-.959v-1h1.205l-.246 1zm-2.678 10.897-1.039-.897h1.26l-.221.897zm14.552 12.024-3.958-.973c.008-.01.01-.022.017-.032.106-.139.189-.29.24-.453.003-.009.003-.018.006-.028a1.488 1.488 0 0 0-.455-1.56l-1.2-1.036a1.504 1.504 0 0 0-.418-1.682 1.504 1.504 0 0 0-1.724-.167l-6.211-5.361 3.174-12.92L26.013 7.56l-.835 3.398a.499.499 0 0 0 .366.604l3.399.836-4.055 16.51zm3.119-18.456.489.808-2.227-.548.547-2.226 1.191 1.966zm-6.132-4.938-1.819-.447V3.694l1.819 1.82zM7.055 2.987h12v1.834l-4.942-1.214a.501.501 0 0 0-.604.366l-.003.014h-1.95a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h1.213l-.491 2h-1.722a.5.5 0 0 0 0 1h1.476l-.491 2H8.555a.5.5 0 0 0 0 1h2.739l-.491 2H8.555a.493.493 0 0 0-.294.106l-1.149-.992a.465.465 0 0 0-.057-.042V2.987zM4.322 16.569l-1.025-2.458 2.581.655-1.181 1.368-.375.435zm1.208.131 9.841 8.494-.653.757-4.835-4.173-3.001-2.591-.002-.001-2.002-1.728.652-.758zm1.525 3.958 1.943 1.677-.406 1.652H7.055v-3.329zm2.792 2.41 3.473 2.998-3.97-.975.497-2.023zm5.181 4.279a.499.499 0 0 1 .048-.238c.005-.01.017-.015.021-.025.016-.035.035-.077.047-.094.002-.002.002-.005.004-.006l1.305-1.512.002-.001.001-.002 1.305-1.512a.47.47 0 0 1 .166-.123c.022-.01.045-.012.068-.019a.472.472 0 0 1 .128-.027.536.536 0 0 1 .113.013c.022.004.044.004.065.011a.5.5 0 0 1 .216.798l-2.614 3.027a.495.495 0 0 1-.706.052.511.511 0 0 1-.169-.342z"></path>
                  </svg>
                  <div className="space-y-2">
                    <h3 className="font-bold">Report</h3>
                    <p className="text-sm text-muted-foreground">
                      Gain valuable insights into each assignment outcomes.
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                <div className="flex gap-2 flex-col justify-between rounded-md p-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    data-name="Layer 1"
                    viewBox="0 0 100 100"
                    width="64"
                    height="64"
                    id="announcement"
                    fill="currentColor"
                  >
                    <path d="M73.448 40.913a8.446 8.446 0 0 0-7.468-14.856l-7.957-15.83a1.499 1.499 0 0 0-2.367-.418l-28.76 27.048-16.699 8.393A8.537 8.537 0 0 0 6.41 56.7l6.907 13.74a8.514 8.514 0 0 0 11.448 3.789l.839-.422 5.203 10.354a10.525 10.525 0 0 0 8.156 5.735l5.712.691a1.618 1.618 0 0 0 .181.01 1.5 1.5 0 0 0 1.362-.871l2.163-4.689a1.501 1.501 0 0 0-.585-1.91l-4.49-2.72a3.098 3.098 0 0 1-1.41-3.346l.859-3.703a1.5 1.5 0 0 0-1.306-1.83l-4.772-.497-1.12-2.226 5.907-2.97 38.865-6.942a1.499 1.499 0 0 0 1.076-2.15Zm-.198-9.21a5.47 5.47 0 0 1-1.18 6.469l-4.712-9.374a5.466 5.466 0 0 1 5.892 2.905ZM36.485 58.784 27.66 63.22l-.124-.041-.97-1.93a.094.094 0 0 1 .041-.126l8.823-4.434ZM23.417 71.55a5.528 5.528 0 0 1-7.421-2.456L9.089 55.352a5.536 5.536 0 0 1 2.456-7.422l15.553-7.818 6.986 13.896-8.823 4.435a3.097 3.097 0 0 0-1.374 4.153l.97 1.93a3.072 3.072 0 0 0 1.791 1.547 3.104 3.104 0 0 0 .975.159 3.07 3.07 0 0 0 1.386-.332l8.823-4.435 1.14 2.266Zm10.947 1.563a1.498 1.498 0 0 0 1.185.819l3.898.405-.475 2.048a6.1 6.1 0 0 0 2.779 6.589l3.343 2.025-1.144 2.48-4.627-.56a7.534 7.534 0 0 1-5.837-4.104L28.283 72.46l4.593-2.308ZM74.372 56.91 62.837 33.96a1.5 1.5 0 1 0-2.68 1.348L71.291 57.46l-29.468 5.264-12.215-24.3 21.807-20.508 4.539 9.031a1.5 1.5 0 1 0 2.68-1.347l-4.94-9.828 2.552-2.4 10.788 21.46 3.123 6.215v.001l7.664 15.245Z"></path>
                    <path d="M16.209 48.267a1.578 1.578 0 1 0 2.118.7 1.577 1.577 0 0 0-2.118-.7zm7.192-1.85a1.578 1.578 0 1 0-.7 2.118 1.578 1.578 0 0 0 .7-2.118zm59.677-33.88a1.5 1.5 0 0 0-2.094.34l-6.408 8.89a1.5 1.5 0 1 0 2.434 1.755l6.408-8.891a1.5 1.5 0 0 0-.34-2.094zm9.943 21.198-10.958-.162h-.022a1.5 1.5 0 0 0-.023 3l10.958.162H93a1.5 1.5 0 0 0 .022-3zm-12.186-4.34a1.485 1.485 0 0 0 .673-.16l11.276-5.668a1.5 1.5 0 1 0-1.348-2.68L80.16 26.557a1.5 1.5 0 0 0 .675 2.84z"></path>
                  </svg>
                  <div className="space-y-2">
                    <h3 className="font-bold">Announcements</h3>
                    <p className="text-sm text-muted-foreground">
                      Keep your class updated with ease by making announcements
                      through our platform
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                <div className="flex gap-2 flex-col justify-between rounded-md p-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    fill="currentColor"
                    height="64"
                    id="notes"
                  >
                    <path d="M59.614 11.268H42.271V4.375a1 1 0 0 0-1.874-.486l-.445.801-.449-.803a1.001 1.001 0 0 0-.873-.512h-.003a1.001 1.001 0 0 0-.873.517l-.433.785-.437-.787a1.001 1.001 0 0 0-1.748 0l-.441.795-.442-.795a1 1 0 0 0-1.874.486v6.893H16.203a1 1 0 0 0-1 1l.001 27.777c-.208 4.289-.549 7.873-1.012 10.688H4.386a1 1 0 0 0-.93 1.366c.033.085 3.459 8.527 7.402 8.527H54.277c.007 0 .012-.003.018-.003.756-.01 1.447-.298 2.043-.854.838-.756 1.526-1.994 2.102-3.777 1.099-3.334 1.83-8.735 2.176-16.098V12.268c-.002-.553-.449-1-1.002-1zM34.378 7.692c.436.147.962-.05 1.19-.463l.441-.793.44.793a.999.999 0 0 0 .874.515h.001c.364 0 .699-.199.875-.517l.437-.792.445.797c.177.316.511.512.873.512h.001c.109 0 .215-.018.315-.051v11.52a.999.999 0 0 0-1.19.464l-.441.794-.441-.794a1.001 1.001 0 0 0-.874-.514h-.002a1 1 0 0 0-.874.518l-.436.791-.445-.796a1.001 1.001 0 0 0-.873-.512h-.001c-.109 0-.215.018-.315.051V7.692zM10.857 58.625c-1.534 0-3.715-3.474-4.918-5.893h41.194c.36.782 1.028 2.138 1.864 3.47.202.328.402.63.603.921l.152.22c.197.278.393.544.587.786l.063.074c.118.146.236.289.354.421H10.857zm45.679-3.254c-.572 1.775-1.153 2.564-1.552 2.923-.317.297-.567.331-.728.331-.887 0-2.217-1.298-3.562-3.479-1.188-1.894-1.97-3.756-1.974-3.764-.006-.015-.017-.026-.022-.041-.006-.014-.016-.025-.021-.039a1.017 1.017 0 0 0-.256-.329.972.972 0 0 0-.165-.111c-.049-.028-.096-.055-.15-.074-.044-.015-.091-.019-.137-.028-.065-.013-.125-.039-.194-.039-.019 0-.034.01-.053.011H16.221c.452-2.85.774-6.336.982-10.64v-.005l.002-.01c.006-.063.01-.127.01-.186 0-.021-.011-.038-.012-.058V13.268h15.175v9.261a1 1 0 0 0 1.874.486l.445-.801.449.803c.177.316.511.512.873.512h.003a1 1 0 0 0 .873-.518l.433-.785.438.789a1.001 1.001 0 0 0 1.748-.001l.441-.794.441.794c.051.091.116.168.188.237.026.025.056.043.084.065a.974.974 0 0 0 .27.148c.057.02.113.033.173.043.039.006.076.014.116.015.015.001.027.006.042.006a1 1 0 0 0 1-1v-9.261h16.343l.001 26.578c-.334 7.136-1.032 12.357-2.077 15.526z"></path>
                    <path d="M51.726 26.501c-1.157 0-1.799.411-2.268.71-.386.247-.619.396-1.191.396s-.806-.149-1.19-.396c-.469-.299-1.111-.71-2.268-.71s-1.798.411-2.266.71c-.385.247-.617.395-1.188.395s-.803-.148-1.188-.395c-.468-.3-1.109-.71-2.265-.71s-1.797.411-2.265.711c-.385.246-.616.395-1.187.395-.568 0-.8-.148-1.184-.395-.468-.3-1.109-.711-2.265-.711s-1.797.411-2.265.711c-.385.246-.616.395-1.187.395s-.803-.148-1.188-.395c-.468-.3-1.109-.71-2.265-.71a1 1 0 1 0 0 2c.57 0 .802.148 1.187.395.468.3 1.109.711 2.266.711 1.155 0 1.797-.411 2.265-.711.385-.246.616-.395 1.187-.395.569 0 .801.148 1.185.395.468.3 1.109.711 2.264.711 1.155 0 1.797-.411 2.265-.711.385-.246.616-.395 1.187-.395s.802.148 1.187.395c.468.3 1.109.711 2.266.711s1.798-.411 2.266-.71c.385-.247.617-.395 1.188-.395s.805.149 1.189.395c.469.3 1.111.71 2.269.71s1.799-.411 2.268-.71c.386-.247.619-.396 1.191-.396a1 1 0 1 0 0-2.001zm0 7.696c-1.157 0-1.799.411-2.268.71-.386.247-.619.396-1.191.396s-.806-.149-1.19-.396c-.469-.299-1.111-.71-2.268-.71s-1.798.411-2.266.71c-.385.247-.617.395-1.188.395s-.803-.148-1.188-.395c-.468-.3-1.109-.71-2.265-.71s-1.797.411-2.265.711c-.385.246-.616.395-1.187.395-.568 0-.8-.148-1.184-.395-.468-.3-1.109-.711-2.265-.711s-1.797.411-2.265.711c-.385.246-.616.395-1.187.395s-.803-.148-1.188-.395c-.468-.3-1.109-.71-2.265-.71a1 1 0 1 0 0 2c.57 0 .802.148 1.187.395.468.3 1.109.711 2.266.711 1.155 0 1.797-.411 2.265-.711.385-.246.616-.395 1.187-.395.569 0 .801.148 1.185.395.468.3 1.109.711 2.264.711 1.155 0 1.797-.411 2.265-.711.385-.246.616-.395 1.187-.395s.802.148 1.187.395c.468.3 1.109.711 2.266.711s1.798-.411 2.266-.71c.385-.247.617-.395 1.188-.395s.805.149 1.189.395c.469.3 1.111.71 2.269.71s1.799-.411 2.268-.71c.386-.247.619-.396 1.191-.396a1 1 0 1 0 0-2.001zm0 7.5c-1.157 0-1.799.411-2.268.71-.386.247-.619.396-1.191.396s-.806-.149-1.19-.396c-.469-.299-1.111-.71-2.268-.71s-1.798.411-2.266.71c-.385.247-.617.395-1.188.395s-.803-.148-1.188-.395c-.468-.3-1.109-.71-2.265-.71s-1.797.411-2.265.711c-.385.246-.616.395-1.187.395-.568 0-.8-.148-1.184-.395-.468-.3-1.109-.711-2.265-.711s-1.797.411-2.265.711c-.385.246-.616.395-1.187.395s-.803-.148-1.188-.395c-.468-.3-1.109-.71-2.265-.71a1 1 0 1 0 0 2c.57 0 .802.148 1.187.395.468.3 1.109.711 2.266.711 1.155 0 1.797-.411 2.265-.711.385-.246.616-.395 1.187-.395.569 0 .801.148 1.185.395.468.3 1.109.711 2.264.711 1.155 0 1.797-.411 2.265-.711.385-.246.616-.395 1.187-.395s.802.148 1.187.395c.468.3 1.109.711 2.266.711s1.798-.411 2.266-.71c.385-.247.617-.395 1.188-.395s.805.149 1.189.395c.469.3 1.111.71 2.269.71s1.799-.411 2.268-.71c.386-.247.619-.396 1.191-.396a1 1 0 1 0 0-2.001z"></path>
                  </svg>
                  <div className="space-y-2">
                    <h3 className="font-bold">Materials</h3>
                    <p className="text-sm text-muted-foreground">
                      Simplify the distribution of course materials by uploading
                      them directly to your class.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      </main>
      <SiteFooter />
    </div>
  );
}
