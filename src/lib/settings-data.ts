
import type { SiteSettings } from './settings';

export const defaultSiteSettings: SiteSettings = {
  id: 'main',
  banners: [
    {
      id: 'banner-1',
      src: 'https://placehold.co/1920x1080.png',
      alt: 'Free Fire Diamonds Banner',
      title: 'FREE FIRE DIAMONDS',
      description: 'Get your game diamonds instantly and securely. The best prices, guaranteed.',
      buttonText: 'Top Up Now',
      buttonLink: '/top-up/diamond-top-up-bd',
      aiHint: 'gaming background',
      enabled: true,
    },
    {
      id: 'banner-2',
      src: 'https://placehold.co/1920x1080.png',
      alt: 'PUBG UC Banner',
      title: 'PUBG MOBILE UC',
      description: 'Load up on Unknown Cash and dominate the battlegrounds.',
      buttonText: 'Get UC Now',
      buttonLink: '/top-up/pubg-mobile-uc',
      aiHint: 'battle royale action',
      enabled: true,
    },
    {
      id: 'banner-3',
      src: 'https://placehold.co/1920x1080.png',
      alt: 'Vouchers Banner',
      title: 'GAME VOUCHERS',
      description: 'All your favorite game vouchers in one place.',
      buttonText: 'Browse Vouchers',
      buttonLink: '/',
      aiHint: 'gift cards gaming',
      enabled: true,
    },
  ],
  aboutUsPage: `
    <h1 class="text-3xl md:text-4xl font-bold mb-8 text-center font-headline">আমাদের সম্পর্কে (About Us)</h1>
    <div class="space-y-10 text-lg">
        <div class="space-y-4">
            <h2 class="text-2xl font-semibold text-foreground border-b border-primary/20 pb-2">BURNERS TOP-UP STORE-এ স্বাগতম!</h2>
            <p>
            গেমিং জগতে আপনার বিশ্বস্ত পার্টনার, BURNERS TOP-UP STORE-এ আপনাকে স্বাগতম। আমরা বিশ্বাস করি, গেমারদের জন্য সেরা গেমিং অভিজ্ঞতা নিশ্চিত করতে দ্রুত, নিরাপদ এবং সাশ্রয়ী টপ-আপ সার্ভিস অপরিহার্য। আর এই লক্ষ্য নিয়েই আমাদের পথচলা শুরু।
            </p>
        </div>
        <div class="space-y-4">
            <h2 class="text-2xl font-semibold text-foreground border-b border-primary/20 pb-2">আমাদের গল্প</h2>
            <p>
            আমরাও আপনাদের মতোই গেমার। আমরা জানি, গেম খেলতে গিয়ে যখন হঠাত্ ডায়মন্ড বা UC-এর প্রয়োজন হয়, তখন দ্রুত এবং নির্ভরযোগ্য একটি প্ল্যাটফর্ম খুঁজে পাওয়া কতটা কঠিন। বাজারে অনেক অপশন থাকলেও, বেশিরভাগ সময় দাম বেশি হয়, প্রক্রিয়া জটিল হয়, অথবা নিরাপত্তা নিয়ে চিন্তা করতে হয়। এই সমস্যাগুলো সমাধান করতেই আমরা তৈরি করেছি BURNERS TOP-UP STORE। আমাদের উদ্দেশ্য ছিল এমন একটি প্ল্যাটফর্ম তৈরি করা, যেখানে একজন গেমার কোনো ঝামেলা ছাড়াই নিজের পছন্দের গেমের কারেন্সি টপ-আপ করতে পারবে, সম্পূর্ণ নিশ্চিন্তে।
            </p>
        </div>
        <div class="space-y-4">
            <h2 class="text-2xl font-semibold text-foreground border-b border-primary/20 pb-2">আমরা কী করি?</h2>
            <p>
            BURNERS TOP-UP STORE-এ আমরা বিভিন্ন জনপ্রিয় গেমের জন্য টপ-আপ সার্ভিস দিয়ে থাকি:
            </p>
            <ul class="list-disc pl-6 space-y-3 mt-4">
              <li><strong class="font-semibold text-foreground">Free Fire Diamonds:</strong> আপনার পছন্দের আইটেম কিনতে বা র‍্যাঙ্ক আপ করতে দ্রুততম সময়ে ডায়মন্ড টপ-আপ করুন।</li>
              <li><strong class="font-semibold text-foreground">PUBG Mobile UC:</strong> নতুন স্কিন, রয়্যাল পাস এবং আরও অনেক কিছু আনলক করতে নিরাপদে UC কিনুন।</li>
              <li><strong class="font-semibold text-foreground">Mobile Legends Diamonds:</strong> আপনার হিরোদের শক্তিশালী করতে বা নতুন স্কিন পেতে ডায়মন্ড টপ-আপ করুন।</li>
              <li><strong class="font-semibold text-foreground">Vouchers & Gift Cards:</strong> বিভিন্ন প্ল্যাটফর্মের জন্য গিফট কার্ড এবং ভাউচার কিনুন।</li>
              <li><strong class="font-semibold text-foreground">এবং আরও অনেক কিছু!</strong> আমরা সবসময় নতুন গেম এবং সার্ভিস যুক্ত করার চেষ্টা করি, যাতে আপনি এক জায়গায় সব সমাধান পান।</li>
            </ul>
        </div>
        <div class="space-y-4">
            <h2 class="text-2xl font-semibold text-foreground border-b border-primary/20 pb-2">কেন আমাদের বেছে নেবেন?</h2>
            <ol class="list-decimal pl-6 space-y-3 mt-4">
                <li><strong class="font-semibold text-foreground">দ্রুত ডেলিভারি:</strong> আমাদের Automated Top-up সিস্টেমের কারণে আপনার পেমেন্ট কনফার্ম হওয়ার সাথে সাথেই আপনার অ্যাকাউন্টে কারেন্সি পৌঁছে যাবে।</li>
                <li><strong class="font-semibold text-foreground">১০০% নিরাপদ:</strong> আমরা আপনার অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করি। আমাদের পেমেন্ট গেটওয়েগুলো সুরক্ষিত এবং আমরা কোনো ব্যক্তিগত তথ্য সংরক্ষণ করি না।</li>
                <li><strong class="font-semibold text-foreground">প্রতিযোগিতামূলক দাম:</strong> আমরা বাজারে সেরা দাম দেওয়ার প্রতিশ্রুতি দিই। আমাদের লক্ষ্য হলো আপনাকে সবচেয়ে সাশ্রয়ী মূল্যে টপ-আপ সার্ভিস দেওয়া।</li>
                <li><strong class="font-semibold text-foreground">২৪/৭ কাস্টমার সাপোর্ট:</strong> আমাদের ডেডিকেটেড সাপোর্ট টিম সবসময় আপনার পাশে আছে। যেকোনো সমস্যা বা প্রশ্নের জন্য আমাদের সাথে যোগাযোগ করতে পারেন।</li>
                <li><strong class="font-semibold text-foreground">সহজ প্রক্রিয়া:</strong> আমাদের ওয়েবসাইটটি ব্যবহার করা খুবই সহজ। মাত্র কয়েকটি ক্লিকেই আপনি আপনার টপ-আপ সম্পন্ন করতে পারবেন।</li>
            </ol>
        </div>
        <div class="space-y-4">
            <h2 class="text-2xl font-semibold text-foreground border-b border-primary/20 pb-2">আমাদের লক্ষ্য (Our Mission)</h2>
            <p>
            আমাদের লক্ষ্য হলো গেমিং কমিউনিটির জন্য একটি নির্ভরযোগ্য এবং ঝামেলামুক্ত টপ-আপ প্ল্যাটফর্ম হিসেবে নিজেদের প্রতিষ্ঠিত করা। আমরা শুধু একটি স্টোর নই, আমরা আপনার গেমিং যাত্রার অংশীদার।
            </p>
        </div>
        <div class="pt-8 text-center space-y-2">
            <p class="text-xl font-medium text-foreground">আমাদের উপর আস্থা রাখার জন্য ধন্যবাদ।</p>
            <p class="text-xl font-medium text-foreground">শুভ গেমিং!</p>
            <p class="mt-4 font-semibold text-primary text-2xl">BURNERS TOP-UP STORE টিম</p>
        </div>
    </div>
  `,
  termsPage: `
    <h1 class="text-3xl md:text-4xl font-bold mb-8 text-center font-headline">পরিষেবার শর্তাবলী (Terms of Service)</h1>
    <div class="space-y-10 text-lg">
        <div class="space-y-4">
            <h2 class="text-2xl font-semibold text-foreground border-b border-primary/20 pb-2">BURNERS TOP-UP STORE-এ স্বাগতম!</h2>
            <p>আমাদের ওয়েবসাইট (burnerstore.com) ব্যবহার করার জন্য আপনাকে ধন্যবাদ। এই ওয়েবসাইটে প্রবেশ বা ব্যবহার করার আগে, অনুগ্রহ করে নিম্নলিখিত শর্তাবলী মনোযোগ সহকারে পড়ুন। এই ওয়েবসাইট ব্যবহার করার অর্থ হলো আপনি এই শর্তাবলীতে সম্মত হচ্ছেন। যদি আপনি এই শর্তাবলীর কোনো অংশে একমত না হন, তাহলে অনুগ্রহ করে আমাদের ওয়েবসাইট ব্যবহার করবেন না।</p>
        </div>
        <div class="space-y-4">
            <h2 class="text-2xl font-semibold text-foreground border-b border-primary/20 pb-2">১. পরিষেবা</h2>
            <p>BURNERS TOP-UP STORE বিভিন্ন অনলাইন গেমের ইন-গেম কারেন্সি (যেমন: Free Fire Diamonds, PUBG UC, Mobile Legends Diamonds, ইত্যাদি) টপ-আপ এবং ভাউচার বিক্রি করে থাকে। আমাদের পরিষেবাগুলো ব্যবহার করার জন্য আপনাকে কোনো অ্যাকাউন্ট তৈরি করতে হতে পারে অথবা নির্দিষ্ট তথ্য (যেমন: গেম আইডি) প্রদান করতে হতে পারে।</p>
        </div>
        <div class="space-y-4">
            <h2 class="text-2xl font-semibold text-foreground border-b border-primary/20 pb-2">২. ব্যবহারকারীর দায়িত্ব</h2>
            <p><strong class="font-semibold text-foreground">ক. সঠিক তথ্য প্রদান:</strong> টপ-আপ করার সময়, আপনাকে অবশ্যই সঠিক এবং বৈধ গেম আইডি, ইউজারনেম এবং অন্যান্য প্রয়োজনীয় তথ্য প্রদান করতে হবে। ভুল তথ্য প্রদানের কারণে যদি টপ-আপ ব্যর্থ হয়, তাহলে BURNERS TOP-UP STORE এর জন্য দায়ী থাকবে না এবং কোনো রিফান্ড দেওয়া হবে না।</p>
            <p><strong class="font-semibold text-foreground">খ. পেমেন্ট:</strong> আপনাকে অবশ্যই বৈধ পেমেন্ট পদ্ধতি ব্যবহার করতে হবে এবং আপনার পেমেন্টের জন্য পর্যাপ্ত তহবিল থাকতে হবে। কোনো ধরনের প্রতারণামূলক বা অবৈধ পেমেন্ট কার্যক্রম কঠোরভাবে নিষিদ্ধ।</p>
            <p><strong class="font-semibold text-foreground">গ. ব্যবহারের সীমাবদ্ধতা:</strong> আপনি আমাদের পরিষেবাগুলো শুধুমাত্র বৈধ উদ্দেশ্যে ব্যবহার করতে পারবেন। কোনো অবৈধ, প্রতারণামূলক বা ক্ষতিকারক কার্যকলাপের জন্য এই প্ল্যাটফর্ম ব্যবহার করা যাবে না।</p>
        </div>
        <div class="space-y-4">
            <h2 class="text-2xl font-semibold text-foreground border-b border-primary/20 pb-2">৩. ডেলিভারি এবং রিফান্ড</h2>
            <p><strong class="font-semibold text-foreground">ক. ডেলিভারি:</strong> সাধারণত, পেমেন্ট সফল হওয়ার পর টপ-আপ স্বয়ংক্রিয়ভাবে এবং দ্রুত আপনার গেমিং অ্যাকাউন্টে পৌঁছে যায়। কিছু ক্ষেত্রে, প্রযুক্তিগত সমস্যার কারণে ডেলিভারি বিলম্বিত হতে পারে।</p>
            <p><strong class="font-semibold text-foreground">খ. রিফান্ড নীতি:</strong> একবার টপ-আপ সম্পন্ন হয়ে গেলে, সাধারণত কোনো রিফান্ড দেওয়া হয় না। যদি কোনো কারণে আপনার পেমেন্ট সফল হয় কিন্তু টপ-আপ না পৌঁছায়, তাহলে আমাদের কাস্টমার সাপোর্ট টিমের সাথে যোগাযোগ করুন। আপনার পেমেন্টের প্রমাণ (যেমন: ট্রানজেকশন আইডি) দেখাতে হবে। ভুল গেম আইডি বা ইউজারনেম প্রদানের কারণে টপ-আপ ব্যর্থ হলে কোনো রিফান্ড দেওয়া হবে না।</p>
        </div>
        <div class="space-y-4">
            <h2 class="text-2xl font-semibold text-foreground border-b border-primary/20 pb-2">৪. মূল্য এবং পেমেন্ট</h2>
            <p>আমাদের ওয়েবসাইটে প্রদর্শিত সকল মূল্য পরিবর্তন সাপেক্ষে। আমরা যেকোনো সময় মূল্য পরিবর্তন করার অধিকার রাখি। সকল পেমেন্ট আপনার নির্বাচিত পেমেন্ট গেটওয়ের মাধ্যমে সুরক্ষিতভাবে সম্পন্ন হয়।</p>
        </div>
        <div class="space-y-4">
            <h2 class="text-2xl font-semibold text-foreground border-b border-primary/20 pb-2">৫. দায়বদ্ধতার সীমাবদ্ধতা</h2>
            <p>BURNERS TOP-UP STORE কোনোভাবেই আপনার গেমিং অ্যাকাউন্টের সাসপেনশন, ব্যান বা অন্য কোনো সমস্যার জন্য দায়ী নয়, যা আমাদের টপ-আপ সার্ভিসের কারণে ঘটেছে। টপ-আপ প্রক্রিয়ায় আমরা শুধু গেমিং কোম্পানির নিয়ম অনুসরণ করি। গেমিং কোম্পানির নিজস্ব নীতির কারণে কোনো সমস্যা হলে তা আমাদের নিয়ন্ত্রণের বাইরে।</p>
        </div>
        <div class="space-y-4">
            <h2 class="text-2xl font-semibold text-foreground border-b border-primary/20 pb-2">৬. পরিবর্তন</h2>
            <p>আমরা যেকোনো সময় এই শর্তাবলী পরিবর্তন, সংশোধন বা আপডেট করার অধিকার রাখি। কোনো পরিবর্তনের পর ওয়েবসাইট ব্যবহার চালিয়ে গেলে তা আপনার নতুন শর্তাবলীতে সম্মত হওয়ার প্রমাণ হিসেবে বিবেচিত হবে।</p>
        </div>
        <div class="space-y-4">
            <h2 class="text-2xl font-semibold text-foreground border-b border-primary/20 pb-2">৭. যোগাযোগ</h2>
            <p>এই শর্তাবলী সম্পর্কে আপনার কোনো প্রশ্ন থাকলে, অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন: <a href="mailto:support@burnerstore.com" class="text-primary hover:underline">support@burnerstore.com</a>।</p>
        </div>
    </div>
  `,
  privacyPage: `
    <h1 class="text-3xl md:text-4xl font-bold mb-8 text-center font-headline">গোপনীয়তা নীতি (Privacy Policy)</h1>
    <div class="space-y-10 text-lg">
        <p>এই গোপনীয়তা নীতি ব্যাখ্যা করে যে BURNERS TOP-UP STORE (burnerstore.com) তার ব্যবহারকারীদের কাছ থেকে কীভাবে তথ্য সংগ্রহ, ব্যবহার, এবং সংরক্ষণ করে। আপনার গোপনীয়তা আমাদের কাছে অত্যন্ত গুরুত্বপূর্ণ।</p>
        <div class="space-y-4">
            <h2 class="text-2xl font-semibold text-foreground border-b border-primary/20 pb-2">১. আমরা কী ধরনের তথ্য সংগ্রহ করি?</h2>
            <p>আমরা নিম্নলিখিত তথ্যগুলো সংগ্রহ করতে পারি:</p>
            <ul class="list-disc pl-6 space-y-3 mt-4">
                <li><strong class="font-semibold text-foreground">ক. অ্যাকাউন্ট তথ্য (যদি প্রযোজ্য হয়):</strong> যদি আপনি আমাদের ওয়েবসাইটে অ্যাকাউন্ট তৈরি করেন, তাহলে আপনার নাম, ইমেইল ঠিকানা, এবং পাসওয়ার্ড (এনক্রিপ্টেড) সংগ্রহ করা হতে পারে।</li>
                <li><strong class="font-semibold text-foreground">খ. লেনদেনের তথ্য:</strong> যখন আপনি টপ-আপ করেন, তখন আমরা আপনার গেম আইডি, ইউজারনেম, টপ-আপ করা পরিমাণ, এবং লেনদেনের বিবরণ (যেমন: ট্রানজেকশন আইডি) সংগ্রহ করি।</li>
                <li><strong class="font-semibold text-foreground">গ. পেমেন্ট তথ্য:</strong> আমরা সরাসরি আপনার ক্রেডিট কার্ড বা মোবাইল ব্যাংকিং পিন/পাসওয়ার্ডের মতো সংবেদনশীল পেমেন্ট তথ্য সংগ্রহ করি না। সকল পেমেন্ট একটি সুরক্ষিত থার্ড-পার্টি পেমেন্ট গেটওয়ের (যেমন: bKash, Nagad, Rocket) মাধ্যমে প্রক্রিয়া করা হয়।</li>
                <li><strong class="font-semibold text-foreground">ঘ. ব্যবহারের তথ্য:</strong> আমরা আপনার ব্রাউজারের ধরন, IP Address, ভিজিট করা পেজ, এবং ওয়েবসাইটে কাটানো সময় সম্পর্কে তথ্য সংগ্রহ করতে পারি।</li>
            </ul>
        </div>
        <div class="space-y-4">
            <h2 class="text-2xl font-semibold text-foreground border-b border-primary/20 pb-2">২. আমরা কেন এই তথ্য সংগ্রহ করি?</h2>
            <p>আমরা আপনার তথ্য নিম্নলিখিত উদ্দেশ্যে ব্যবহার করি:</p>
            <ul class="list-disc pl-6 space-y-3 mt-4">
                <li><strong class="font-semibold text-foreground">ক. পরিষেবা প্রদান:</strong> আপনার টপ-আপ অর্ডার সম্পন্ন করার জন্য।</li>
                <li><strong class="font-semibold text-foreground">খ. কাস্টমার সাপোর্ট:</strong> আপনার কোনো প্রশ্ন বা সমস্যার সমাধান করার জন্য।</li>
                <li><strong class="font-semibold text-foreground">গ. সেবা উন্নত করা:</strong> আমাদের ওয়েবসাইট এবং পরিষেবাগুলোকে আরও উন্নত করতে।</li>
                <li><strong class="font-semibold text-foreground">ঘ. নিরাপত্তা:</strong> প্রতারণা বা অবৈধ কার্যক্রম থেকে আপনার অ্যাকাউন্টকে রক্ষা করতে।</li>
                <li><strong class="font-semibold text-foreground">ঙ. যোগাযোগ:</strong> আপনার সাথে অর্ডারের আপডেট বা অফার নিয়ে যোগাযোগ করতে (যদি আপনি সম্মতি দেন)।</li>
            </ul>
        </div>
        <div class="space-y-4">
            <h2 class="text-2xl font-semibold text-foreground border-b border-primary/20 pb-2">৩. আমরা কীভাবে আপনার তথ্য সুরক্ষিত রাখি?</h2>
            <p>আমরা আপনার তথ্যের নিরাপত্তা নিশ্চিত করতে বিভিন্ন সুরক্ষা ব্যবস্থা গ্রহণ করি। আমরা আপনার পেমেন্ট তথ্য সরাসরি সংরক্ষণ করি না। আমাদের পেমেন্ট গেটওয়েগুলো SSL এনক্রিপশন ব্যবহার করে, যা আপনার লেনদেনকে সুরক্ষিত রাখে।</p>
        </div>
        <div class="space-y-4">
            <h2 class="text-2xl font-semibold text-foreground border-b border-primary/20 pb-2">৪. থার্ড-পার্টির সাথে তথ্য শেয়ারিং</h2>
            <p>আমরা আপনার ব্যক্তিগত তথ্য কোনো থার্ড-পার্টির কাছে বিক্রি, ভাড়া বা বাণিজ্য করি না। তবে, নিম্নলিখিত পরিস্থিতিতে তথ্য শেয়ার করা হতে পারে:</p>
             <ul class="list-disc pl-6 space-y-3 mt-4">
                <li><strong class="font-semibold text-foreground">ক. পেমেন্ট প্রসেসর:</strong> পেমেন্ট সম্পন্ন করার জন্য আমরা পেমেন্ট গেটওয়ের সাথে আপনার লেনদেনের তথ্য শেয়ার করি।</li>
                <li><strong class="font-semibold text-foreground">খ. আইনি বাধ্যবাধকতা:</strong> আইনগত বাধ্যবাধকতা বা সরকারি সংস্থার অনুরোধে আমরা তথ্য প্রকাশ করতে পারি।</li>
                <li><strong class="font-semibold text-foreground">গ. সেবা প্রদানকারী:</strong> আমাদের ওয়েবসাইট পরিচালনার জন্য প্রয়োজনীয় থার্ড-পার্টি সার্ভিস প্রোভাইডারদের (যেমন: হোস্টিং সার্ভিস) সাথে সীমিত তথ্য শেয়ার করা হতে পারে।</li>
            </ul>
        </div>
         <div class="space-y-4">
            <h2 class="text-2xl font-semibold text-foreground border-b border-primary/20 pb-2">৫. কুকিজ (Cookies)</h2>
            <p>আমাদের ওয়েবসাইট আপনার ব্রাউজারে কিছু ছোট ডেটা ফাইল (কুকিজ) ব্যবহার করতে পারে। কুকিজ ওয়েবসাইটকে আপনার পছন্দ মনে রাখতে এবং আপনার ব্রাউজিং অভিজ্ঞতা উন্নত করতে সাহায্য করে। আপনি আপনার ব্রাউজার সেটিংস থেকে কুকিজ নিষ্ক্রিয় করতে পারেন, তবে এটি ওয়েবসাইটের কিছু কার্যকারিতাকে প্রভাবিত করতে পারে।</p>
        </div>
         <div class="space-y-4">
            <h2 class="text-2xl font-semibold text-foreground border-b border-primary/20 pb-2">৬. আপনার অধিকার</h2>
            <p>আপনার ব্যক্তিগত তথ্য সম্পর্কে আপনার কিছু অধিকার রয়েছে, যেমন: আপনার তথ্য অ্যাক্সেস করা, সংশোধন করা বা মুছে ফেলার অনুরোধ করা। এই বিষয়ে কোনো অনুরোধ থাকলে আমাদের সাথে যোগাযোগ করুন।</p>
        </div>
         <div class="space-y-4">
            <h2 class="text-2xl font-semibold text-foreground border-b border-primary/20 pb-2">৭. এই নীতির পরিবর্তন</h2>
            <p>আমরা এই গোপনীয়তা নীতি যেকোনো সময় আপডেট করার অধিকার রাখি। কোনো পরিবর্তনের পর ওয়েবসাইট ব্যবহার চালিয়ে গেলে তা আপনার নতুন নীতিতে সম্মত হওয়ার প্রমাণ হিসেবে বিবেচিত হবে।</p>
        </div>
        <div class="space-y-4">
            <h2 class="text-2xl font-semibold text-foreground border-b border-primary/20 pb-2">৮. যোগাযোগ</h2>
            <p>এই নীতি সম্পর্কে আপনার কোনো প্রশ্ন বা উদ্বেগ থাকলে, অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন:</p>
            <div class="mt-2 text-foreground bg-secondary/50 p-4 rounded-lg">
                <p class="font-semibold">BURNERS TOP-UP STORE</p>
                <p>ইমেইল: support@burnerstore.com</p>
                <p>ওয়েবসাইট: burnerstore.com</p>
            </div>
        </div>
    </div>
  `,
  tutorialVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  supportPhone: '+123456789',
  supportWhatsapp: '123456789',
  socialLinks: [
    { id: 'facebook', label: 'Facebook', url: 'https://facebook.com', enabled: true },
    { id: 'twitter', label: 'Twitter', url: 'https://twitter.com', enabled: true },
    { id: 'instagram', label: 'Instagram', url: 'https://instagram.com', enabled: true },
    { id: 'whatsapp', label: 'WhatsApp', url: 'https://wa.me/123456789', enabled: true },
  ],
};
